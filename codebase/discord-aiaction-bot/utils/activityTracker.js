const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DAILY_LOG_PATH = path.join(DATA_DIR, 'daily_activity.json');

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Khởi tạo file log nếu chưa có
if (!fs.existsSync(DAILY_LOG_PATH)) {
    fs.writeFileSync(DAILY_LOG_PATH, JSON.stringify([]), 'utf8');
}

/**
 * Categorize question into predefined topics
 */
function categorizeQuestion(question) {
    const lower = question.toLowerCase();
    if (lower.includes('deadline') || lower.includes('nộp bài') || lower.includes('checkpoint') || lower.includes('bài tập')) {
        return '[Deadline/Nộp bài]';
    }
    if (lower.includes('lỗi') || lower.includes('bug') || lower.includes('code') || lower.includes('không chạy') || lower.includes('cài đặt')) {
        return '[Lỗi kỹ thuật/Code]';
    }
    if (lower.includes('tài liệu') || lower.includes('bài giảng') || lower.includes('video') || lower.includes('slide') || lower.includes('học máy')) {
        return '[Tài liệu/Bài giảng]';
    }
    return '[Quy chế/Khác]';
}

/**
 * Logs an interaction
 */
function logInteraction(user, question, escalated = false) {
    try {
        const logs = JSON.parse(fs.readFileSync(DAILY_LOG_PATH, 'utf8'));
        const topic = categorizeQuestion(question);
        
        logs.push({
            timestamp: new Date().toISOString(),
            user,
            question,
            topic,
            escalated
        });
        
        fs.writeFileSync(DAILY_LOG_PATH, JSON.stringify(logs, null, 2), 'utf8');
    } catch (e) {
        console.error('❌ Lỗi khi ghi log daily_activity:', e.message);
    }
}

/**
 * Generates an EOD Digest Embed
 */
function generateDigestEmbed() {
    try {
        const logs = JSON.parse(fs.readFileSync(DAILY_LOG_PATH, 'utf8'));
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Filter for today's logs (or last 24h)
        const todaysLogs = logs.filter(log => log.timestamp.startsWith(todayStr));
        
        const total = todaysLogs.length;
        const escalatedLogs = todaysLogs.filter(log => log.escalated);
        const pending = escalatedLogs.length;
        const success = total - pending;

        // Topic stats
        const topicCount = {};
        todaysLogs.forEach(log => {
            topicCount[log.topic] = (topicCount[log.topic] || 0) + 1;
        });
        
        const sortedTopics = Object.entries(topicCount).sort((a, b) => b[1] - a[1]);
        const top3Topics = sortedTopics.slice(0, 3).map(([topic, count], idx) => {
            const percent = ((count / total) * 100).toFixed(1);
            return `**${idx + 1}. ${topic}**: ${count} câu (${percent}%)`;
        }).join('\n') || 'Chưa có dữ liệu';

        // Top 5 pending
        const top5Pending = escalatedLogs.slice(-5).reverse().map(log => {
            return `• **${log.user}**: "${log.question}"`;
        }).join('\n') || '🎉 Không có câu hỏi nào tồn đọng!';

        const embed = new EmbedBuilder()
            .setTitle(`📊 BÁO CÁO HOẠT ĐỘNG TRONG NGÀY (${new Date().toLocaleDateString('vi-VN')})`)
            .setColor('#0099ff')
            .addFields(
                { name: '📈 Tổng quan', value: `Tổng số câu hỏi: **${total}**\nĐã trả lời thành công: **${success}**\nĐang tồn đọng (Cần TA): **${pending}**`, inline: false },
                { name: '🔥 Top 3 Chủ đề', value: top3Topics, inline: false },
                { name: '🚨 Cần xử lý gấp (Top 5 gần nhất)', value: top5Pending, inline: false }
            )
            .setFooter({ text: 'Discord Assistant EOD Digest' })
            .setTimestamp();

        return embed;
    } catch (e) {
        console.error('❌ Lỗi khi tạo digest embed:', e.message);
        return null;
    }
}

module.exports = {
    logInteraction,
    generateDigestEmbed
};
