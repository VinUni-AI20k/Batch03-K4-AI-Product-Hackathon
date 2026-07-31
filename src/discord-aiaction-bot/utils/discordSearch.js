const { ChannelType } = require('discord.js');

/**
 * Resolves a channel by ID or name, prioritizing configured environment IDs.
 * @param {Guild} guild 
 * @param {string} nameOrId 
 * @returns {Promise<Channel|null>}
 */
async function resolveChannel(guild, nameOrId) {
    if (!guild || !nameOrId) return null;
    
    // Clean search term
    const cleanName = nameOrId.toLowerCase().replace(/^(kênh|forum|room|channel|diễn đàn|bảng tin)\s+/, '').trim();

    // 1. Try resolving by ID if it's numeric/Snowflake
    if (/^\d+$/.test(cleanName)) {
        let ch = guild.channels.cache.get(cleanName);
        if (!ch) {
            ch = await guild.channels.fetch(cleanName).catch(() => null);
        }
        if (ch) return ch;
    }

    // 2. Prioritize configured mapping from environment variables
    if (cleanName === 'thông báo' || cleanName === 'thông-báo') {
        const id = process.env.ANNOUNCEMENT_CHANNEL_ID;
        if (id) {
            const ch = await guild.channels.fetch(id).catch(() => null);
            if (ch) return ch;
        }
    }
    if (cleanName === 'tài nguyên' || cleanName === 'tài-nguyên') {
        const id = process.env.RESOURCE_CHANNEL_ID;
        if (id) {
            const ch = await guild.channels.fetch(id).catch(() => null);
            if (ch) return ch;
        }
    }
    if (cleanName === 'chia sẻ' || cleanName === 'chia-sẻ' || cleanName === 'trao đổi' || cleanName === 'trao-đổi') {
        const ids = process.env.DISCUSSION_CHANNEL_IDS ? process.env.DISCUSSION_CHANNEL_IDS.split(',').map(id => id.trim()) : [];
        for (const id of ids) {
            const ch = await guild.channels.fetch(id).catch(() => null);
            if (ch) return ch;
        }
    }

    // 3. Exact matching by name in cache/guild
    const channels = await guild.channels.fetch().catch(() => new Map());
    let match = channels.find(ch => ch.name.toLowerCase() === cleanName);
    if (!match) {
        // Match without hyphens
        match = channels.find(ch => ch.name.toLowerCase().replace(/-/g, ' ') === cleanName.replace(/-/g, ' '));
    }
    return match || null;
}

/**
 * Resolves a forum channel specifically.
 * @param {Guild} guild 
 * @param {string} nameOrId 
 * @returns {Promise<Channel|null>}
 */
async function resolveForum(guild, nameOrId) {
    const channel = await resolveChannel(guild, nameOrId);
    if (channel && channel.type === ChannelType.GuildForum) {
        return channel;
    }
    
    // If not direct match, search guild specifically for Forum channels
    const cleanName = nameOrId.toLowerCase().replace(/^(forum|kênh|channel)\s+/, '').trim();
    const channels = await guild.channels.fetch().catch(() => new Map());
    const forumMatch = channels.find(ch => ch.type === ChannelType.GuildForum && 
        (ch.name.toLowerCase() === cleanName || ch.name.toLowerCase().replace(/-/g, ' ') === cleanName.replace(/-/g, ' '))
    );
    return forumMatch || null;
}

/**
 * Fetches all threads (both active and archived) from a forum channel.
 * @param {ForumChannel} forumChannel 
 * @returns {Promise<Array>}
 */
async function getAllThreads(forumChannel) {
    let threadsList = [];
    try {
        // Fetch active threads
        const activeRes = await forumChannel.threads.fetchActive();
        threadsList.push(...activeRes.threads.values());
        
        // Fetch archived threads (takes care of pagination/archived ones)
        const archivedRes = await forumChannel.threads.fetchArchived();
        threadsList.push(...archivedRes.threads.values());
    } catch (error) {
        console.error(`[Discord Search] Lỗi khi tải threads từ forum #${forumChannel.name}:`, error.message);
    }
    return threadsList;
}

/**
 * Helper để kiểm tra chuỗi có khớp từ khóa (hoặc các token) không.
 */
function isTextMatch(text, queryLower) {
    if (!text) return false;
    const t = text.toLowerCase();
    if (t.includes(queryLower)) return true;
    
    // Tách từ khóa và lọc các stop words tiếng Việt cơ bản
    const stopwords = ['con', 'và', 'cái', 'những', 'của', 'về', 'trong', 'cho', 'có', 'là', 'các', 'một', 'để', 'tìm', 'bài'];
    const tokens = queryLower.split(/\s+/).filter(tk => !stopwords.includes(tk) && tk.length >= 2);
    if (tokens.length === 0) return false;
    
    // Trả về true nếu CÓ BẤT KỲ từ khóa chính nào xuất hiện trong text (search thoáng hơn)
    return tokens.some(tk => t.includes(tk));
}

/**
 * Searches messages in a Text Channel containing the query.
 * @param {TextChannel} channel 
 * @param {string} query 
 * @returns {Promise<Array>}
 */
async function searchMessages(channel, query) {
    if (!channel || !query) return [];
    try {
        const messages = await channel.messages.fetch({ limit: 100 }).catch(() => []);
        const queryLower = query.toLowerCase();
        const results = [];

        for (const msg of messages.values()) {
            if (isTextMatch(msg.content, queryLower)) {
                results.push({
                    message: msg,
                    title: `Tin nhắn tại #${channel.name}`,
                    author: msg.author.username,
                    timestamp: msg.createdAt,
                    link: msg.url,
                    excerpt: msg.content
                });
            }
        }
        return results;
    } catch (error) {
        console.error(`[Discord Search] Lỗi khi tìm tin nhắn trong #${channel.name}:`, error.message);
        return [];
    }
}


/**
 * Searches threads in a Forum Channel by title, starter content, or comment content.
 * @param {ForumChannel} forumChannel 
 * @param {string} query 
 * @returns {Promise<Array>}
 */
async function searchThreads(forumChannel, query) {
    if (!forumChannel || !query) return [];
    const threads = await getAllThreads(forumChannel);
    const results = [];
    const queryLower = query.toLowerCase();

    for (const thread of threads) {
        let isMatch = false;
        let matchReason = '';
        let excerpt = '';

        // 1. Check title
        if (isTextMatch(thread.name, queryLower)) {
            isMatch = true;
            matchReason = 'title';
        }

        // 2. Fetch messages to check contents
        let messages = [];
        try {
            const fetched = await thread.messages.fetch({ limit: 50 }).catch(() => []);
            messages = Array.from(fetched.values());
        } catch (e) {
            // Ignore
        }

        let starterMsg = null;
        if (messages.length > 0) {
            starterMsg = messages[messages.length - 1]; // oldest fetched message
        } else {
            starterMsg = await thread.fetchStarterMessage().catch(() => null);
        }

        if (starterMsg && !isMatch && isTextMatch(starterMsg.content, queryLower)) {
            isMatch = true;
            matchReason = 'starter_content';
            excerpt = starterMsg.content;
        }

        // 3. Check other comments/messages if not already matched
        if (!isMatch) {
            for (const msg of messages) {
                if (isTextMatch(msg.content, queryLower)) {
                    isMatch = true;
                    matchReason = 'comment_content';
                    excerpt = msg.content;
                    break;
                }
            }
        }

        if (isMatch) {
            if (!excerpt && starterMsg) {
                excerpt = starterMsg.content;
            }
            results.push({
                thread: thread,
                title: thread.name,
                author: starterMsg ? starterMsg.author.username : 'Ẩn danh',
                timestamp: thread.createdAt || new Date(thread.createdTimestamp),
                link: thread.url,
                excerpt: excerpt ? excerpt : '(Không có nội dung)'
            });
        }
    }

    return results;
}

/**
 * Sorts and retrieves the latest thread/message.
 * @param {Channel} channelOrForum 
 * @returns {Promise<Object|null>}
 */
async function getLatestPost(channelOrForum) {
    if (channelOrForum.type === ChannelType.GuildForum) {
        const threads = await getAllThreads(channelOrForum);
        if (threads.length === 0) return null;
        // Sort descending by createdTimestamp
        threads.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
        return threads[0];
    } else {
        const messages = await channelOrForum.messages.fetch({ limit: 100 }).catch(() => []);
        const msgList = Array.from(messages.values());
        if (msgList.length === 0) return null;
        // Sort descending by createdTimestamp
        msgList.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
        return msgList[0];
    }
}

/**
 * Sorts and retrieves the oldest thread/message.
 * @param {Channel} channelOrForum 
 * @returns {Promise<Object|null>}
 */
async function getOldestPost(channelOrForum) {
    if (channelOrForum.type === ChannelType.GuildForum) {
        const threads = await getAllThreads(channelOrForum);
        if (threads.length === 0) return null;
        // Sort ascending by createdTimestamp
        threads.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        return threads[0];
    } else {
        const messages = await channelOrForum.messages.fetch({ limit: 100 }).catch(() => []);
        const msgList = Array.from(messages.values());
        if (msgList.length === 0) return null;
        // Sort ascending by createdTimestamp
        msgList.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        return msgList[0];
    }
}

/**
 * Gets the standard URL of the post/message.
 * @param {Object} postOrMessage 
 * @returns {string|null}
 */
function getPostLink(postOrMessage) {
    if (!postOrMessage) return null;
    return postOrMessage.url || null;
}

/**
 * Builds the URL of the post/message.
 * @param {Object} postOrMessage 
 * @returns {string|null}
 */
function buildDiscordURL(postOrMessage) {
    return getPostLink(postOrMessage);
}

/**
 * Main query controller that parses the user's query and performs live Discord lookup.
 * @param {Guild} guild 
 * @param {string} queryText 
 * @returns {Promise<string|null>}
 */
async function executeDiscordQuery(guild, queryText) {
    if (!guild) return null;
    const queryLower = queryText.toLowerCase().trim();

    // 1. Detect if it's a direct channel query
    const hasChannelKeywords = queryLower.includes('trong kênh') || 
                               queryLower.includes('trong forum') || 
                               queryLower.includes('trong channel') || 
                               queryLower.includes('kênh chia-sẻ') || 
                               queryLower.includes('kênh tài-nguyên') ||
                               queryLower.includes('forum chia-sẻ');
    
    const hasQueryKeywords = queryLower.includes('mới nhất') || 
                             queryLower.includes('cũ nhất') || 
                             queryLower.includes('bài viết') ||
                             queryLower.includes('tin nhắn') ||
                             queryLower.includes('tìm bài') ||
                             queryLower.includes('tìm tin') ||
                             queryLower.match(/(?:tìm|kiếm|hỏi|xem)\s+/i);

    if (!hasChannelKeywords && !hasQueryKeywords) {
        return null; // Not a structured query, pass to LLM
    }

    // 2. Parse Channel Type requested
    let requestedType = null; // 'forum' or 'text'
    if (queryLower.includes('forum')) {
        requestedType = 'forum';
    } else if (queryLower.includes('kênh') || queryLower.includes('channel') || queryLower.includes('room')) {
        requestedType = 'text';
    }

    // 3. Parse Channel Name
    let channelName = null;
    if (queryLower.includes('chia-sẻ') || queryLower.includes('chia sẻ')) {
        channelName = 'chia-sẻ';
    } else if (queryLower.includes('tài-nguyên') || queryLower.includes('tài nguyên')) {
        channelName = 'tài-nguyên';
    } else if (queryLower.includes('thông báo') || queryLower.includes('thông-báo')) {
        channelName = 'thông-báo';
    }

    // 4. Parse Sort Mode
    let sortMode = null; // 'latest' or 'oldest'
    if (queryLower.includes('mới nhất') || queryLower.includes('latest')) {
        sortMode = 'latest';
    } else if (queryLower.includes('cũ nhất') || queryLower.includes('oldest')) {
        sortMode = 'oldest';
    }

    // 5. Parse Search query content (removing channel indicators first to prevent name inclusion)
    let searchContent = null;
    let cleanQuery = queryLower;
    // Chỉ loại bỏ cụm "trong [tên kênh]" nếu đó là các kênh liên quan đến khóa học (để tránh xóa nhầm các từ như "trong giáo dục", "trong học tập")
    const knownChannelNames = ['chia-sẻ', 'chia sẻ', 'tài-nguyên', 'tài nguyên', 'thông-báo', 'thông báo'];
    const channelPattern = knownChannelNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const stripRegex = new RegExp(`\\s+trong\\s+(?:forum|kênh|channel|room|diễn đàn)?\\s*(?:${channelPattern})`, 'gi');
    cleanQuery = cleanQuery.replace(stripRegex, '').trim();
    
    let searchMatch = cleanQuery.match(/về\s+(.+)/i);
    if (searchMatch) {
        searchContent = searchMatch[1].trim();
    } else {
        // Fallback: Lấy phần còn lại của câu sau các từ khóa tìm kiếm
        const fallbackMatch = cleanQuery.match(/(?:tìm|kiếm|hỏi|xem|link)\s+(?:bài viết|bài|tin nhắn|tin|thảo luận)?\s*(.*)/i);
        if (fallbackMatch && fallbackMatch[1]) {
            searchContent = fallbackMatch[1].trim();
        }
    }

    // --- EXECUTE RESOLUTION ---
    let resolvedChannel = null;
    if (channelName) {
        if (requestedType === 'forum') {
            resolvedChannel = await resolveForum(guild, channelName);
        } else {
            resolvedChannel = await resolveChannel(guild, channelName);
        }
    } else {
        // Fallback: If no channel is specified but search content exists, default to search in discussion channel
        const ids = process.env.DISCUSSION_CHANNEL_IDS ? process.env.DISCUSSION_CHANNEL_IDS.split(',').map(id => id.trim()) : [];
        if (ids.length > 0) {
            resolvedChannel = await guild.channels.fetch(ids[0]).catch(() => null);
        }
    }

    // --- VARIABLES FOR LOGGING ---
    let channelId = 'N/A';
    let channelTypeStr = 'N/A';
    let searchMode = searchContent ? 'content_search' : (sortMode ? 'sort_only' : 'none');
    let sortStr = sortMode || 'none';
    let threadCount = 0;
    let messageCount = 0;
    let selectedResult = null;
    let createdTimestamp = 'N/A';
    let returnedUrl = 'N/A';

    if (resolvedChannel) {
        channelId = resolvedChannel.id;
        channelTypeStr = resolvedChannel.type === ChannelType.GuildForum ? 'GuildForum' : 'GuildText';
    } else {
        // Cannot resolve channel requested, return warning or let LLM handle it
        if (channelName) {
            return `Dạ, mình không tìm thấy channel hoặc forum có tên là **"${channelName}"** trên server. Bạn vui lòng kiểm tra lại tên nhé!`;
        }
        return null;
    }

    // Verify permissions
    const botMember = guild.members.me || await guild.members.fetch(guild.client.user.id).catch(() => null);
    if (botMember && resolvedChannel) {
        const permissions = resolvedChannel.permissionsFor(botMember);
        if (permissions && !permissions.has('ViewChannel')) {
            console.warn(`[Discord Search] Quyền truy cập bị từ chối cho channel #${resolvedChannel.name}`);
            return `Dạ, mình không có quyền xem thông tin trong channel **#${resolvedChannel.name}**. Bạn vui lòng cấp quyền cho Bot xem nhé!`;
        }
    }

    let responseMessage = '';

    // --- EXECUTE SEARCH / SORT ---
    if (searchContent) {
        if (resolvedChannel.type === ChannelType.GuildForum) {
            const results = await searchThreads(resolvedChannel, searchContent);
            threadCount = results.length;
            if (results.length > 0) {
                // Default sorting of matching search results (Newest first)
                if (sortMode === 'oldest') {
                    results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                } else {
                    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                }
                
                responseMessage = `Tìm thấy ${results.length} bài viết/thảo luận liên quan đến **"${searchContent}"** trong forum **#${resolvedChannel.name}**:\n\n`;
                const displayLimit = Math.min(results.length, 5);
                for (let i = 0; i < displayLimit; i++) {
                    const match = results[i];
                    responseMessage += `${i + 1}. **${match.title}**\n` +
                        `🔗 Link: <${match.link}>\n` +
                        `👤 Đăng bởi: \`${match.author}\` | 📅 Ngày: ${match.timestamp.toLocaleString('vi-VN')}\n` +
                        `📝 Đoạn trích: *${match.excerpt.substring(0, 100)}${match.excerpt.length > 100 ? '...' : ''}*\n\n`;
                }

                if (results.length > 5) {
                    responseMessage += `*Và ${results.length - 5} bài viết liên quan khác...*`;
                }

                const firstMatch = results[0];
                selectedResult = `${firstMatch.title} (Tổng cộng ${results.length} kết quả)`;
                createdTimestamp = firstMatch.timestamp.toLocaleString('vi-VN');
                returnedUrl = firstMatch.link;
            } else {
                responseMessage = `Dạ, mình tìm kiếm trong forum **#${resolvedChannel.name}** nhưng không thấy bài viết nào về **"${searchContent}"**.`;
            }
        } else {
            const results = await searchMessages(resolvedChannel, searchContent);
            messageCount = results.length;
            if (results.length > 0) {
                if (sortMode === 'oldest') {
                    results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                } else {
                    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                }
                
                responseMessage = `Tìm thấy ${results.length} tin nhắn liên quan đến **"${searchContent}"** trong kênh **#${resolvedChannel.name}**:\n\n`;
                const displayLimit = Math.min(results.length, 5);
                for (let i = 0; i < displayLimit; i++) {
                    const match = results[i];
                    responseMessage += `${i + 1}. **Tin nhắn của ${match.author}**\n` +
                        `🔗 Link: <${match.link}>\n` +
                        `📅 Ngày: ${match.timestamp.toLocaleString('vi-VN')}\n` +
                        `📝 Nội dung: *${match.excerpt.substring(0, 100)}${match.excerpt.length > 100 ? '...' : ''}*\n\n`;
                }

                if (results.length > 5) {
                    responseMessage += `*Và ${results.length - 5} tin nhắn liên quan khác...*`;
                }

                const firstMatch = results[0];
                selectedResult = `Tin nhắn của ${firstMatch.author} (Tổng cộng ${results.length} kết quả)`;
                createdTimestamp = firstMatch.timestamp.toLocaleString('vi-VN');
                returnedUrl = firstMatch.link;
            } else {
                responseMessage = `Dạ, mình tìm trong kênh **#${resolvedChannel.name}** nhưng không thấy tin nhắn nào chứa từ khóa **"${searchContent}"**.`;
            }
        }
    } else if (sortMode) {
        if (sortMode === 'latest') {
            const item = await getLatestPost(resolvedChannel);
            if (item) {
                const isThread = resolvedChannel.type === ChannelType.GuildForum;
                selectedResult = isThread ? item.name : `Tin nhắn của ${item.author.username}`;
                createdTimestamp = new Date(item.createdTimestamp).toLocaleString('vi-VN');
                returnedUrl = item.url;
                
                if (isThread) {
                    const fetchedMessages = await item.messages.fetch({ limit: 1 }).catch(() => []);
                    const starter = fetchedMessages.first() || { content: '(Không có nội dung)' };
                    const ownerName = item.ownerId ? (await guild.members.fetch(item.ownerId).catch(() => ({user:{username:'Ẩn danh'}}))).user.username : 'Ẩn danh';
                    
                    responseMessage = `Bài viết mới nhất trong forum **#${resolvedChannel.name}**:\n` +
                        `📌 **Tiêu đề:** ${item.name}\n` +
                        `👤 **Tác giả:** ${ownerName}\n` +
                        `📅 **Thời gian tạo:** ${createdTimestamp}\n` +
                        `🔗 **Link bài viết:** ${returnedUrl}\n` +
                        `📝 **Nội dung:** *${starter.content.substring(0, 150)}${starter.content.length > 150 ? '...' : ''}*`;
                } else {
                    responseMessage = `Tin nhắn mới nhất trong kênh **#${resolvedChannel.name}**:\n` +
                        `👤 **Người đăng:** ${item.author.username}\n` +
                        `📅 **Thời gian:** ${createdTimestamp}\n` +
                        `🔗 **Link tin nhắn:** ${returnedUrl}\n` +
                        `📝 **Nội dung:** *${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}*`;
                }
            } else {
                responseMessage = `Không tìm thấy tin nhắn/bài viết nào trong channel **#${resolvedChannel.name}**.`;
            }
        } else {
            const item = await getOldestPost(resolvedChannel);
            if (item) {
                const isThread = resolvedChannel.type === ChannelType.GuildForum;
                selectedResult = isThread ? item.name : `Tin nhắn của ${item.author.username}`;
                createdTimestamp = new Date(item.createdTimestamp).toLocaleString('vi-VN');
                returnedUrl = item.url;

                if (isThread) {
                    const fetchedMessages = await item.messages.fetch({ limit: 1 }).catch(() => []);
                    const starter = fetchedMessages.first() || { content: '(Không có nội dung)' };
                    const ownerName = item.ownerId ? (await guild.members.fetch(item.ownerId).catch(() => ({user:{username:'Ẩn danh'}}))).user.username : 'Ẩn danh';

                    responseMessage = `Bài viết cũ nhất trong forum **#${resolvedChannel.name}**:\n` +
                        `📌 **Tiêu đề:** ${item.name}\n` +
                        `👤 **Tác giả:** ${ownerName}\n` +
                        `📅 **Thời gian tạo:** ${createdTimestamp}\n` +
                        `🔗 **Link bài viết:** ${returnedUrl}\n` +
                        `📝 **Nội dung:** *${starter.content.substring(0, 150)}${starter.content.length > 150 ? '...' : ''}*`;
                } else {
                    responseMessage = `Tin nhắn cũ nhất trong kênh **#${resolvedChannel.name}**:\n` +
                        `👤 **Người đăng:** ${item.author.username}\n` +
                        `📅 **Thời gian:** ${createdTimestamp}\n` +
                        `🔗 **Link tin nhắn:** ${returnedUrl}\n` +
                        `📝 **Nội dung:** *${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}*`;
                }
            } else {
                responseMessage = `Không tìm thấy tin nhắn/bài viết nào trong channel **#${resolvedChannel.name}**.`;
            }
        }
    }

    // --- LOG OUTPUT ---
    console.log(`
User query: ${queryText}
Resolved channel: ${resolvedChannel ? resolvedChannel.name : 'None'}
Channel ID: ${channelId}
Channel type: ${channelTypeStr}
Search mode: ${searchMode}
Sort: ${sortStr}
Thread count: ${threadCount}
Message count: ${messageCount}
Selected result: ${selectedResult || 'None'}
Created timestamp: ${createdTimestamp}
Returned URL: ${returnedUrl}
`);

    return responseMessage || null;
}

module.exports = {
    resolveChannel,
    resolveForum,
    getAllThreads,
    searchMessages,
    searchThreads,
    getLatestPost,
    getOldestPost,
    getPostLink,
    buildDiscordURL,
    executeDiscordQuery
};
