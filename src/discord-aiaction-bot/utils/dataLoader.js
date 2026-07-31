const fs = require('fs');
const path = require('path');

/**
 * Loads and parses a JSON file safely.
 * @param {string} filePath 
 * @returns {Array|Object}
 */
function loadJsonFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`[WARNING] File không tồn tại: ${filePath}`);
            return [];
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`[ERROR] Không thể đọc hoặc parse file ${filePath}:`, error.message);
        return [];
    }
}

/**
 * Loads all mock data and builds a context string.
 * @returns {string}
 */
function loadContextData() {
    const dataDir = path.join(__dirname, '..', 'data');
    
    const announcements = loadJsonFile(path.join(dataDir, 'announcements.json'));
    const courseDocs = loadJsonFile(path.join(dataDir, 'course_docs.json'));
    const forumPosts = loadJsonFile(path.join(dataDir, 'forum_posts.json'));

    let context = '=== DỮ LIỆU THAM KHẢO HỆ THỐNG ===\n\n';

    context += '--- THÔNG BÁO (Tier 1) ---\n';
    if (announcements.length === 0) {
        context += 'Không có thông báo nào.\n';
    } else {
        announcements.forEach((ann, idx) => {
            context += `[Thông báo ${idx + 1}] Tiêu đề: ${ann.title} (Ngày: ${ann.date})\nNội dung: ${ann.content}\n\n`;
        });
    }

    context += '--- TÀI LIỆU KHÓA HỌC (Tier 1) ---\n';
    if (courseDocs.length === 0) {
        context += 'Không có tài liệu nào.\n';
    } else {
        courseDocs.forEach((doc, idx) => {
            context += `[Tài liệu ${idx + 1}] Tiêu đề: ${doc.title} (Phần: ${doc.section})\nNội dung: ${doc.content}\n\n`;
        });
    }

    context += '--- BÀI VIẾT DIỄN ĐÀN / Q&A (Tier 2) ---\n';
    if (forumPosts.length === 0) {
        context += 'Không có bài viết nào.\n';
    } else {
        forumPosts.forEach((post, idx) => {
            context += `[Q&A ${idx + 1}] Chủ đề: ${post.topic} (Người viết: ${post.author})\nHướng giải quyết: ${post.solution}\n\n`;
        });
    }

    context += '=== HẾT DỮ LIỆU THAM KHẢO ===';
    return context;
}

module.exports = {
    loadContextData
};
