const { ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { loadContextData } = require('./dataLoader');

// Global memory cache for Discord channel data
let discordCache = {
    announcements: [],
    courseDocs: [],
    forumPosts: []
};

/**
 * Helper to fetch a web page title from a URL
 */
async function fetchUrlTitle(url) {
    try {
        let cleanUrl = url.trim();
        // Remove trailing characters that might be part of markdown or message punctuation
        if (cleanUrl.endsWith(')') || cleanUrl.endsWith(']') || cleanUrl.endsWith('}')) {
            cleanUrl = cleanUrl.slice(0, -1);
        }
        
        // Only fetch HTTP/HTTPS protocols
        if (!/^https?:\/\//i.test(cleanUrl)) return null;

        const res = await fetch(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
            },
            signal: AbortSignal.timeout(3000) // 3 seconds timeout
        });
        if (!res.ok) return null;
        const html = await res.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
            let title = titleMatch[1].trim();
            title = title.replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'");
            title = title.replace(/\s*-\s*YouTube/gi, '')
                         .replace(/\s*\|\s*YouTube/gi, '');
            return title;
        }
    } catch (e) {
        console.error(`[UrlResolver] Lỗi khi lấy tiêu đề cho ${url}:`, e.message);
    }
    return null;
}

/**
 * Parses content, extracts URLs, fetches titles, and enriches content with them
 */
async function enrichContentWithUrlTitles(content) {
    if (!content) return content;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = content.match(urlRegex);
    if (!matches) return content;

    let enrichedContent = content;
    for (const url of matches) {
        const title = await fetchUrlTitle(url);
        if (title) {
            // Replace the URL with "URL (Tiêu đề: ...)"
            // Only replace if it doesn't already have a title label next to it
            if (!enrichedContent.includes(`${url} (Tiêu đề:`)) {
                enrichedContent = enrichedContent.replace(url, `${url} (Tiêu đề: ${title})`);
            }
        }
    }
    return enrichedContent;
}


// Configuration from environment variables
const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID;
const RESOURCE_CHANNEL_ID = process.env.RESOURCE_CHANNEL_ID;
const DISCUSSION_CHANNEL_IDS = process.env.DISCUSSION_CHANNEL_IDS ? process.env.DISCUSSION_CHANNEL_IDS.split(',').map(id => id.trim()) : [];

/**
 * Helper to fetch messages from a text-based channel
 */
async function fetchTextChannelMessages(client, channelId, limit = 20) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) return [];

        if (channel.isTextBased()) {
            const messages = await channel.messages.fetch({ limit });
            const messageList = Array.from(messages.values());
            const parsedMessages = await Promise.all(messageList.map(async msg => {
                const attachments = msg.attachments.map(att => att.url).join(', ');
                const enrichedContent = await enrichContentWithUrlTitles(msg.content);
                return {
                    author: msg.author.username,
                    content: enrichedContent,
                    url: msg.url,
                    attachments: attachments ? ` (Đính kèm: ${attachments})` : '',
                    createdAt: msg.createdAt.toLocaleString('vi-VN')
                };
            }));
            return parsedMessages;
        }
        return [];
    } catch (error) {
        console.error(`[Discord Loader] Lỗi khi tải tin nhắn từ channel ${channelId}:`, error.message);
        return [];
    }
}


/**
 * Helper to fetch threads from a forum channel or active threads in guild
 */
async function fetchForumThreads(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) return [];

        let posts = [];
        if (channel.type === ChannelType.GuildForum) {
            const activeThreads = await channel.threads.fetchActive();
            for (const [threadId, thread] of activeThreads.threads) {
                const starterMsg = await thread.fetchStarterMessage().catch(() => null);
                const messages = await thread.messages.fetch({ limit: 5 });
                const messageList = Array.from(messages.values()).reverse();
                
                const discussionParts = await Promise.all(messageList.map(async m => {
                    const enrichedContent = await enrichContentWithUrlTitles(m.content);
                    return `${m.author.username}: ${enrichedContent}`;
                }));
                const discussion = discussionParts.join('\n');
                
                posts.push({
                    topic: thread.name,
                    author: starterMsg ? starterMsg.author.username : 'Ẩn danh',
                    link: thread.url,
                    discussion: discussion
                });
            }
        }
        return posts;
    } catch (error) {
        console.error(`[Discord Loader] Lỗi khi tải forum threads từ channel ${channelId}:`, error.message);
        return [];
    }
}


/**
 * Initializes the cache by fetching from all configured Discord channels
 */
async function initializeDiscordCache(client) {
    console.log('🔄 [Discord Loader] Đang đồng bộ hóa dữ liệu từ các room Discord...');
    
    // 1. Tải thông báo
    if (ANNOUNCEMENT_CHANNEL_ID) {
        console.log(`- Tải thông báo từ channel ID: ${ANNOUNCEMENT_CHANNEL_ID}`);
        discordCache.announcements = await fetchTextChannelMessages(client, ANNOUNCEMENT_CHANNEL_ID, 15);
    }

    // 2. Tải tài nguyên
    if (RESOURCE_CHANNEL_ID) {
        console.log(`- Tải tài nguyên từ channel ID: ${RESOURCE_CHANNEL_ID}`);
        discordCache.courseDocs = await fetchTextChannelMessages(client, RESOURCE_CHANNEL_ID, 20);
    }

    // 3. Tải thảo luận/chia sẻ (có thể là Text Channel hoặc Forum)
    if (DISCUSSION_CHANNEL_IDS.length > 0) {
        const posts = [];
        for (const channelId of DISCUSSION_CHANNEL_IDS) {
            console.log(`- Tải thảo luận từ channel ID: ${channelId}`);
            try {
                const channel = await client.channels.fetch(channelId);
                if (channel) {
                    if (channel.type === ChannelType.GuildForum) {
                        const forumPosts = await fetchForumThreads(client, channelId);
                        posts.push(...forumPosts);
                    } else if (channel.isTextBased()) {
                        const messages = await fetchTextChannelMessages(client, channelId, 20);
                        messages.forEach(msg => {
                            posts.push({
                                topic: `Thảo luận tại #${channel.name}`,
                                author: msg.author,
                                link: msg.url,
                                discussion: `${msg.author}: ${msg.content} ${msg.attachments}`
                            });
                        });
                    }
                }
            } catch (err) {
                console.error(`[Discord Loader] Lỗi khi xử lý channel thảo luận ${channelId}:`, err.message);
            }
        }
        discordCache.forumPosts = posts;
    }

    console.log('✅ [Discord Loader] Đã hoàn thành đồng bộ hóa cache dữ liệu từ Discord!');
}

/**
 * Update cache in real-time when new messages arrive in key channels
 */
function handleIncomingMessageForCache(message) {
    const channelId = message.channel.id;
    const authorName = message.author.username;
    const content = message.content;
    const attachments = message.attachments.map(att => att.url).join(', ');
    const attachmentsStr = attachments ? ` (Đính kèm: ${attachments})` : '';

    // 1. Nếu có thông báo mới
    if (channelId === ANNOUNCEMENT_CHANNEL_ID) {
        console.log(`[Cache Update] Nhận thông báo mới từ #${message.channel.name}`);
        const newItem = {
            author: authorName,
            content: content,
            url: message.url,
            attachments: attachmentsStr,
            createdAt: new Date().toLocaleString('vi-VN')
        };
        discordCache.announcements.unshift(newItem);
        if (discordCache.announcements.length > 30) discordCache.announcements.pop();

        // Enrich asynchronously
        enrichContentWithUrlTitles(content).then(enriched => {
            newItem.content = enriched;
        }).catch(err => console.error('[Cache Update] Lỗi enrich thông báo:', err.message));
    }

    // 2. Nếu có tài nguyên mới
    if (channelId === RESOURCE_CHANNEL_ID) {
        console.log(`[Cache Update] Nhận tài nguyên mới từ #${message.channel.name}`);
        const newItem = {
            author: authorName,
            content: content,
            url: message.url,
            attachments: attachmentsStr,
            createdAt: new Date().toLocaleString('vi-VN')
        };
        discordCache.courseDocs.unshift(newItem);
        if (discordCache.courseDocs.length > 50) discordCache.courseDocs.pop();

        // Enrich asynchronously
        enrichContentWithUrlTitles(content).then(enriched => {
            newItem.content = enriched;
        }).catch(err => console.error('[Cache Update] Lỗi enrich tài nguyên:', err.message));
    }

    // 3. Nếu có tin nhắn thảo luận mới (trong các channel text thảo luận)
    if (DISCUSSION_CHANNEL_IDS.includes(channelId)) {
        console.log(`[Cache Update] Nhận thảo luận mới từ #${message.channel.name}`);
        const newItem = {
            topic: `Thảo luận tại #${message.channel.name}`,
            author: authorName,
            link: message.url,
            discussion: `${authorName}: ${content} ${attachmentsStr}`
        };
        discordCache.forumPosts.unshift(newItem);
        if (discordCache.forumPosts.length > 100) discordCache.forumPosts.pop();

        // Enrich asynchronously
        enrichContentWithUrlTitles(content).then(enriched => {
            newItem.discussion = `${authorName}: ${enriched} ${attachmentsStr}`;
        }).catch(err => console.error('[Cache Update] Lỗi enrich thảo luận:', err.message));
    }
}


/**
 * Returns formatted context string using live Discord data, falling back to JSON files if empty
 */
function getDynamicContextData() {
    const hasLiveAnnouncements = discordCache.announcements.length > 0;
    const hasLiveDocs = discordCache.courseDocs.length > 0;
    const hasLiveForum = discordCache.forumPosts.length > 0;

    // Nếu không có dữ liệu live nào được cấu hình/tải thành công, fallback về mock JSON
    if (!hasLiveAnnouncements && !hasLiveDocs && !hasLiveForum) {
        console.log('[Context] Không có dữ liệu Discord live. Đang fallback sử dụng file JSON...');
        return loadContextData();
    }

    console.log('[Context] Đang sử dụng dữ liệu Discord live từ cache...');
    let context = '=== DỮ LIỆU THAM KHẢO TRỰC TIẾP TỪ SERVER DISCORD ===\n\n';

    context += '--- TIER 1 (OFFICIAL): THÔNG BÁO MỚI NHẤT (Kênh thông-báo) ---\n';
    if (discordCache.announcements.length === 0) {
        context += 'Không có thông báo mới.\n';
    } else {
        discordCache.announcements.forEach((ann, idx) => {
            context += `[Thông báo ${idx + 1}] Nguồn: Thông báo chính thức (Ngày: ${ann.createdAt})\nLink tin nhắn gốc: ${ann.url || 'N/A'}\nNội dung: ${ann.content}${ann.attachments}\n\n`;
        });
    }

    context += '--- TIER 1 (OFFICIAL): TÀI NGUYÊN HỌC TẬP (Kênh tài-nguyên) ---\n';
    if (discordCache.courseDocs.length === 0) {
        context += 'Không có tài nguyên nào.\n';
    } else {
        discordCache.courseDocs.forEach((doc, idx) => {
            context += `[Tài nguyên ${idx + 1}] Nguồn: Tài liệu chính thức (Ngày: ${doc.createdAt})\nLink tin nhắn gốc: ${doc.url || 'N/A'}\nNội dung: ${doc.content}${doc.attachments}\n\n`;
        });
    }

    context += '--- TIER 2 (UGC): BÀI VIẾT DIỄN ĐÀN & THẢO LUẬN HỌC VIÊN (Kênh chia-sẻ / trao-đổi) ---\n';
    context += 'Lưu ý: Đây là thông tin tham khảo từ cộng đồng học viên, KHÔNG phải quy định chính thức.\n';
    if (discordCache.forumPosts.length === 0) {
        context += 'Không có thảo luận nào gần đây.\n';
    } else {
        // Chỉ lấy tối đa 10 thảo luận mới nhất để tránh tràn context
        discordCache.forumPosts.slice(0, 15).forEach((post, idx) => {
            context += `[Thảo luận ${idx + 1}] Chủ đề/Kênh: ${post.topic}\nLink bài viết/thảo luận: ${post.link || 'N/A'}\nCuộc trò chuyện:\n${post.discussion}\n\n`;
        });
    }

    context += '=== HẾT DỮ LIỆU THAM KHẢO ===';
    return context;
}

module.exports = {
    initializeDiscordCache,
    handleIncomingMessageForCache,
    getDynamicContextData
};
