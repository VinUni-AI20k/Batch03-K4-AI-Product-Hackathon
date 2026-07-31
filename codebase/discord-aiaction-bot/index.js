const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const { callLLM } = require('./services/ai');
const { loadContextData } = require('./utils/dataLoader');
const { 
    initializeDiscordCache, 
    handleIncomingMessageForCache, 
    getDynamicContextData 
} = require('./utils/discordDataLoader');
const { executeDiscordQuery } = require('./utils/discordSearch');
const { logInteraction, generateDigestEmbed } = require('./utils/activityTracker');

const BOT_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PREFIX = process.env.PREFIX || '!ask';
const TA_ROLE_ID = process.env.TA_ROLE_ID;
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID;

// === CONVERSATION MEMORY MANAGER ===
const conversationHistory = new Map();
const MAX_HISTORY_LEN = 10; // keep last 10 messages (5 turns)

function getHistory(channelId) {
    if (!conversationHistory.has(channelId)) {
        conversationHistory.set(channelId, []);
    }
    return conversationHistory.get(channelId);
}

function addHistory(channelId, role, content) {
    const history = getHistory(channelId);
    history.push({ role, content });
    if (history.length > MAX_HISTORY_LEN) {
        history.shift();
    }
}

function splitMessageByLines(text, limit = 1900) {
    const lines = text.split('\n');
    const chunks = [];
    let currentChunk = '';

    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > limit) {
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = line + '\n';
        } else {
            currentChunk += line + '\n';
        }
    }
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// CẤU HÌNH LỆNH /HI CÓ THAM SỐ
const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Gửi lời chào thân thiện!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Chọn người bạn muốn Bot chào (Để trống nếu muốn Bot chào chính bạn)')
                .setRequired(false)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.once('ready', async () => {
    console.log(`🤖 Bot đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);
    
    // Khởi tạo và đồng bộ hóa cache dữ liệu từ các room Discord live
    await initializeDiscordCache(client);

    try {
        console.log('🔄 Đang đồng bộ lệnh Slash Command (/)...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('✅ Đã đồng bộ thành công lệnh /hi lên Discord!');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ lệnh:', error);
    }
});

// TÍNH NĂNG 1: XỬ LÝ LỆNH SLASH COMMAND & LOG LỆNH
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hi') {
        try {
            // === PHẦN LOG LỆNH ===
            const timestamp = new Date().toLocaleString('vi-VN');
            const serverName = interaction.guild ? interaction.guild.name : 'Tin nhắn riêng (DM)';
            const channelName = interaction.channel ? interaction.channel.name : 'DM';
            const userName = interaction.user.username;
            const hasTarget = interaction.options.getUser('target');
            const logDetail = hasTarget ? ` (target: ${hasTarget.username})` : '';
            
            const commandLog = `[${timestamp}] [XỬ LÝ LỆNH] [S: ${serverName}] [#${channelName}] ${userName} dùng lệnh: /hi${logDetail}\n`;
            console.log(commandLog.trim());
            fs.appendFile('command_logs.txt', commandLog, 'utf8', (err) => {
                if (err) console.error('❌ Lỗi khi ghi log lệnh:', err);
            });
            // ======================

            // === PHẦN PHẢN HỒI LỆNH ===
            await interaction.deferReply(); 

            let greetingMessage = '';
            if (hasTarget) {
                greetingMessage = `👋 Xin chào **${hasTarget.displayName}**! Bạn được **${interaction.user.displayName}** gửi lời chào độc quyền đó!`;
            } else {
                greetingMessage = `👋 Xin chào **${interaction.user.displayName}**! Chúc bạn một ngày tốt lành!`;
            }

            await interaction.editReply(greetingMessage);

        } catch (error) {
            console.error('❌ Lỗi khi xử lý lệnh /hi:', error);
        }
    }
});

// TÍNH NĂNG 2: TỰ ĐỘNG LOG CHAT THƯỜNG & HỎI ĐÁP AI ASSISTANT
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Cập nhật cache live khi nhận tin nhắn mới từ các room quan trọng
    handleIncomingMessageForCache(message);

    const timestamp = new Date().toLocaleString('vi-VN');
    const serverName = message.guild ? message.guild.name : 'Tin nhắn riêng (DM)';
    const channelName = message.channel ? message.channel.name : 'DM';
    const authorName = message.author.username;
    const content = message.content;

    // Log chat thường vào file
    const logOutput = `[${timestamp}] [CHAT THƯỜNG] [S: ${serverName}] [#${channelName}] ${authorName}: ${content}\n`;
    console.log(logOutput.trim());
    fs.appendFile('chat_logs.txt', logOutput, 'utf8', (err) => {
        if (err) console.error('❌ Lỗi khi ghi file log chat:', err);
    });

    // Xử lý lệnh Báo cáo (Digest)
    if (content.trim().toLowerCase() === '!digest' || content.trim().toLowerCase() === '!baocao') {
        const member = message.member;
        if (!TA_ROLE_ID || (member && member.roles.cache.has(TA_ROLE_ID)) || (member && member.permissions.has('Administrator'))) {
            const embed = generateDigestEmbed();
            if (embed) {
                return message.reply({ embeds: [embed] });
            } else {
                return message.reply('❌ Lỗi khi tạo báo cáo.');
            }
        } else {
            return message.reply('⛔ Bạn không có quyền xem báo cáo (Chỉ dành cho TA/Admin).');
        }
    }

    // --- XỬ LÝ HỎI ĐÁP AI ASSISTANT ---
    
    // Kiểm tra các điều kiện để phản hồi:
    // 1. Bot được tag/mention
    const isMentioned = message.mentions.has(client.user) && !message.mentions.everyone;
    
    // 2. Tin nhắn thuộc channel được cấu hình sẵn
    const isInAllowedChannel = ALLOWED_CHANNEL_ID && message.channel.id === ALLOWED_CHANNEL_ID;
    
    // 3. Tin nhắn bắt đầu bằng prefix
    const hasPrefix = content.trim().startsWith(PREFIX);

    if (isMentioned || isInAllowedChannel || hasPrefix) {
        try {
            console.log(`🤖 [AI Assistant] Phát hiện câu hỏi từ ${authorName} trong channel #${channelName}`);
            
            // Bật hiệu ứng đang gõ tin nhắn (typing)
            await message.channel.sendTyping();

            // Trích xuất câu hỏi thực sự của user
            let userQuery = content;
            if (hasPrefix) {
                userQuery = content.slice(PREFIX.length).trim();
            } else if (isMentioned) {
                // Xóa mention bot khỏi câu hỏi để LLM xử lý chuẩn hơn
                const mentionRegex = new RegExp(`<@!?${client.user.id}>`, 'g');
                userQuery = content.replace(mentionRegex, '').trim();
            }

            if (!userQuery) {
                return message.reply('Dạ, bạn cần mình hỗ trợ giải đáp gì thế ạ?');
            }

            // --- KIỂM TRA TRUY VẤN DISCORD TRỰC TIẾP (MỚI NHẤT/CŨ NHẤT/TÌM BÀI VIẾT) ---
            if (message.guild) {
                const directAnswer = await executeDiscordQuery(message.guild, userQuery);
                if (directAnswer) {
                    await message.reply(directAnswer);
                    console.log(`✅ [AI Assistant] Đã phản hồi trực tiếp truy vấn Discord của học viên ${authorName}`);
                    
                    // Lưu vào lịch sử để các câu tiếp theo có thể tham chiếu
                    addHistory(message.channel.id, 'user', userQuery);
                    addHistory(message.channel.id, 'assistant', directAnswer);
                    return;
                }
            }

            // Tải bối cảnh trò chuyện gần đây trong room/thread hiện tại
            let localContext = '';
            try {
                // Nếu là thread thì lấy 15 tin nhắn mới nhất, nếu là channel thường lấy 5 tin nhắn để hiểu ngữ cảnh hiện tại
                const limit = message.channel.isThread() ? 15 : 5;
                const channelMsgs = await message.channel.messages.fetch({ limit });
                const sortedMsgs = Array.from(channelMsgs.values()).reverse();
                
                const locationType = message.channel.isThread() ? 'THREAD' : 'ROOM';
                localContext = `=== BỐI CẢNH TIN NHẮN GẦN ĐÂY TẠI ${locationType} HIỆN TẠI (Tên: "${message.channel.name}") ===\n`;
                sortedMsgs.forEach(m => {
                    localContext += `[${m.createdAt.toLocaleString('vi-VN')}] ${m.author.username}: ${m.content}\n`;
                });
                localContext += `=== HẾT BỐI CẢNH TIN NHẮN GẦN ĐÂY ===\n\n`;
            } catch (e) {
                console.error(`[AI Assistant] Không thể tải bối cảnh từ channel/thread hiện tại:`, e.message);
            }

            // Tải dữ liệu ngữ cảnh động (từ live room Discord, tự động fallback JSON nếu trống)
            let contextData = getDynamicContextData();
            if (localContext) {
                contextData = localContext + contextData;
            }

            // Dựng System Prompt cho AI
            const systemPrompt = `Bạn là Trợ lý Học viên đắc lực (Discord Assistant) hỗ trợ khóa học. 
Nhiệm vụ của bạn là hỗ trợ học viên giải đáp thắc mắc về bài học, deadline, quy định và tài liệu học tập một cách CHÍNH XÁC, AN TOÀN và ĐÚNG NGUỒN.

### 🛡️ NGUYÊN TẮC AN TOÀN & KIỂM DUYỆT (GUARDRAILS)
1. CENSOR & BẢO MẬT: Ngay lập tức từ chối lịch sự nếu học viên sử dụng ngôn từ kích động, xúc phạm, hỏi thông tin cá nhân, xin API key, hoặc yêu cầu thực hiện hành vi vi phạm nội quy.
2. NGOÀI THẨM QUYỀN: Không tự ý quyết định các vấn đề vượt thẩm quyền (VD: Cho phép gia hạn deadline, sửa điểm, v.v). Với các câu hỏi này, trả lời: "Yêu cầu này vượt quá thẩm quyền của mình. Bạn vui lòng liên hệ trực tiếp TA/Giảng viên để được hỗ trợ nhé!" và đính kèm từ khóa [ESCALATE_TA].

### 📊 PHÂN CẤP NGUỒN TRÍ THỨC (TIERED KNOWLEDGE)
- TIER 1 (OFFICIAL): Thông báo, Tài liệu chính thức -> CHÂN LÝ. Luôn trích dẫn nguồn.
- TIER 2 (UGC): Thảo luận học viên -> BẮT BUỘC dán nhãn: "⚠️ *Lưu ý: Đây là thông tin tham khảo từ thảo luận cộng đồng của học viên, không phải quy định chính thức.*"

### 🎯 NGUYÊN TẮC XỬ LÝ
- KHÔNG BỊA ĐẶT: Nếu thông tin không có trong dữ liệu, tuyệt đối không bịa. Hãy trả lời: "Thông tin này hiện chưa có trong thông báo chính thức. Mình đã chuyển thông tin này tới đội ngũ TA để cập nhật sớm nhất!" và đính kèm từ khóa [ESCALATE_TA].
- THIẾU THÔNG TIN: Nếu câu hỏi mơ hồ, hãy hỏi lại 1 câu để làm rõ context (VD: "Bạn đang hỏi về bài tập nào?").
- LINK TRONG DISCORD: Khi đề cập đến link bài viết/tin nhắn Discord, tuyệt đối KHÔNG bọc link bằng cú pháp Markdown [Text](Url). Thay vào đó, hãy in nguyên văn đường link thô (Ví dụ: "Bạn xem tại đây: https://discord.com/channels/...") để tránh lỗi click.
- NGẮN GỌN: Câu trả lời cần dễ đọc, xuống dòng rõ ràng.

${contextData}`;

            // Lấy lịch sử trò chuyện
            const history = getHistory(message.channel.id);

            // Gọi LLM (OpenRouter hoặc Fallback Gemini) với lịch sử trò chuyện
            const aiResponse = await callLLM(systemPrompt, history, userQuery);

            // Kiểm tra và xử lý Tag TA
            let finalResponse = aiResponse;
            let escalate = false;

            if (finalResponse.includes('[ESCALATE_TA]')) {
                escalate = true;
                // Xóa tag khỏi nội dung tin nhắn để tránh hiển thị thô
                finalResponse = finalResponse.replace(/\[ESCALATE_TA\]/g, '').trim();
            }

            // Gửi câu trả lời
            if (escalate) {
                const taMention = TA_ROLE_ID ? `<@&${TA_ROLE_ID}>` : 'mọi người';
                // Đính kèm tag role TA ở cuối hoặc gửi alert
                finalResponse += `\n\n🔔 *Yêu cầu đã được chuyển tới Ban trợ giảng ${taMention} để hỗ trợ trực tiếp!*`;
            }

            // Nếu câu trả lời quá dài, chia nhỏ ra để gửi (Discord limit 2000 ký tự)
            if (finalResponse.length > 2000) {
                const chunks = splitMessageByLines(finalResponse);
                for (const chunk of chunks) {
                    await message.reply(chunk);
                }
            } else {
                await message.reply(finalResponse);
            }

            // Lưu lượt trao đổi vào lịch sử trò chuyện
            addHistory(message.channel.id, 'user', userQuery);
            addHistory(message.channel.id, 'assistant', finalResponse);

            console.log(`✅ [AI Assistant] Đã phản hồi học viên ${authorName}`);
            
            // Ghi log hoạt động
            logInteraction(authorName, userQuery, escalate);

        } catch (error) {
            console.error('❌ [AI Assistant] Gặp lỗi khi xử lý tin nhắn:', error);
            await message.reply('Dạ, xin lỗi bạn, hệ thống AI của mình đang gặp một chút sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé!');
        }
    }
});

client.login(BOT_TOKEN);
