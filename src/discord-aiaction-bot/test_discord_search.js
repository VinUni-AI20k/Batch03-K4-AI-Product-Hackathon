// test_discord_search.js
const assert = require('assert');
const { ChannelType } = require('discord.js');
const { 
    resolveChannel, 
    resolveForum, 
    searchMessages, 
    searchThreads, 
    getLatestPost, 
    getOldestPost, 
    getPostLink, 
    buildDiscordURL, 
    executeDiscordQuery 
} = require('./utils/discordSearch');

// === SETUP ENV FOR TESTING ===
process.env.ANNOUNCEMENT_CHANNEL_ID = '11111111';
process.env.RESOURCE_CHANNEL_ID = '22222222';
process.env.DISCUSSION_CHANNEL_IDS = '33333333, 44444444';

// === MOCK DISCORD OBJECTS ===
class MockUser {
    constructor(username) {
        this.username = username;
    }
}

class MockMessage {
    constructor(id, content, username, timestamp, url) {
        this.id = id;
        this.content = content;
        this.author = new MockUser(username);
        this.createdTimestamp = timestamp;
        this.createdAt = new Date(timestamp);
        this.url = url;
    }
}

class MockMessageManager {
    constructor(messages = []) {
        this.cache = new Map(messages.map(m => [m.id, m]));
    }
    async fetch(options) {
        let list = Array.from(this.cache.values());
        if (options && options.limit) {
            list = list.slice(0, options.limit);
        }
        // Return a collection-like structure
        return {
            values: () => list[Symbol.iterator](),
            first: () => list[0],
            last: () => list[list.length - 1]
        };
    }
}

class MockThread {
    constructor(id, name, createdTimestamp, url, messages = []) {
        this.id = id;
        this.name = name;
        this.createdTimestamp = createdTimestamp;
        this.createdAt = new Date(createdTimestamp);
        this.url = url;
        this.messages = new MockMessageManager(messages);
        this.ownerId = 'owner_1';
    }
    async fetchStarterMessage() {
        const msgs = Array.from(this.messages.cache.values());
        return msgs[msgs.length - 1] || null; // starter message is the oldest (last in fetched order)
    }
}

class MockThreadManager {
    constructor(threads = []) {
        this.cache = new Map(threads.map(t => [t.id, t]));
    }
    async fetchActive() {
        return { threads: this.cache };
    }
    async fetchArchived() {
        return { threads: new Map() }; // mock empty archived for simplicity in tests
    }
}

class MockChannel {
    constructor(id, name, type, messages = [], threads = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.messages = new MockMessageManager(messages);
        this.threads = new MockThreadManager(threads);
    }
    isTextBased() {
        return this.type === ChannelType.GuildText || this.type === ChannelType.GuildAnnouncement;
    }
    permissionsFor(member) {
        return {
            has: (perm) => true // Mock full permission
        };
    }
}

class MockChannelManager {
    constructor(channels = []) {
        this.cache = new Map(channels.map(c => [c.id, c]));
    }
    async fetch(id) {
        if (id) {
            return this.cache.get(id) || null;
        }
        return this.cache;
    }
}

class MockGuild {
    constructor(channels = []) {
        this.channels = new MockChannelManager(channels);
        this.members = {
            me: { id: 'bot_id' },
            fetch: async (id) => ({ user: { username: 'MockUser' } })
        };
        this.client = { user: { id: 'bot_id' } };
    }
}

// === CREATE TEST ENVIRONMENT DATA ===
const mockAnnouncement = new MockChannel('11111111', 'thông-báo', ChannelType.GuildAnnouncement, [
    new MockMessage('m1', 'Hạn chót nộp bài là trước 08:00 sáng mai', 'admin', 1785460000000, 'https://discord.com/channels/g1/11111111/m1'),
    new MockMessage('m2', 'Chào mừng các bạn đến với Hackathon!', 'admin', 1785450000000, 'https://discord.com/channels/g1/11111111/m2')
]);

const mockResource = new MockChannel('22222222', 'tài-nguyên', ChannelType.GuildText, [
    new MockMessage('r1', 'Slide bài giảng buổi 2 tại link này', 'ta', 1785470000000, 'https://discord.com/channels/g1/22222222/r1'),
    new MockMessage('r2', 'Slide bài giảng buổi 1 tại link kia', 'ta', 1785440000000, 'https://discord.com/channels/g1/22222222/r2')
]);

// Forum "chia-sẻ"
const t1_moon = new MockThread('th1', 'Tìm hiểu về mặt trăng', 1785465000000, 'https://discord.com/channels/g1/th1', [
    new MockMessage('th1_m1', 'Mặt trăng là vệ tinh tự nhiên của Trái Đất', 'student_1', 1785465000000, 'https://discord.com/channels/g1/th1/th1_m1')
]);
const t2_latest = new MockThread('th2', 'Hỏi về Docker setup', 1785480000000, 'https://discord.com/channels/g1/th2', [
    new MockMessage('th2_m1', 'Setup Docker bị lỗi port', 'student_2', 1785480000000, 'https://discord.com/channels/g1/th2/th2_m1')
]);
const t3_oldest = new MockThread('th3', 'Lịch sử phát triển AI', 1785430000000, 'https://discord.com/channels/g1/th3', [
    new MockMessage('th3_m1', 'Lịch sử AI bắt đầu từ Turing test', 'student_3', 1785430000000, 'https://discord.com/channels/g1/th3/th3_m1')
]);

const mockSharingForum = new MockChannel('33333333', 'chia-sẻ', ChannelType.GuildForum, [], [t1_moon, t2_latest, t3_oldest]);

// Duplicate channel named "chia-sẻ" but Text Channel to test dup name / type separation
const mockSharingText = new MockChannel('55555555', 'chia-sẻ', ChannelType.GuildText, [
    new MockMessage('st1', 'Đây là kênh text chia-sẻ của khóa học', 'ta', 1785466000000, 'https://discord.com/channels/g1/55555555/st1')
]);

const guild = new MockGuild([mockAnnouncement, mockResource, mockSharingForum, mockSharingText]);

// === RUN TESTS ===
async function runTests() {
    console.log('🧪 BẮT ĐẦU CHẠY UNIT TESTS CHO DISCORD QUERY LOGIC...\n');

    // Test 1: resolveChannel và resolveForum
    console.log('Test 1: Phân biệt Forum và Text Channel, không nhầm chia-sẻ và tài-nguyên...');
    const resolvedCh1 = await resolveChannel(guild, 'tài-nguyên');
    assert.strictEqual(resolvedCh1.id, '22222222', 'Nên map đúng kênh tài-nguyên bằng ID cấu hình.');

    const resolvedForumCh = await resolveForum(guild, 'chia-sẻ');
    assert.strictEqual(resolvedForumCh.id, '33333333', 'Nên map đúng Forum chia-sẻ.');
    assert.strictEqual(resolvedForumCh.type, ChannelType.GuildForum, 'Phải trả về đúng Forum Channel.');

    const resolvedTextCh = await resolveChannel(guild, 'kênh chia-sẻ');
    assert.strictEqual(resolvedTextCh.id, '33333333', 'Nếu không có chỉ thị forum cụ thể, ưu tiên lấy discussion channel đầu tiên.');
    console.log('✓ Test 1: Đạt!\n');

    // Test 2: Mới nhất & Cũ nhất (Sort by createdTimestamp)
    console.log('Test 2: Lấy bài viết mới nhất và cũ nhất...');
    const latestThread = await getLatestPost(mockSharingForum);
    assert.strictEqual(latestThread.id, 'th2', 'Thread mới nhất phải là th2 (timestamp 1785480000000).');

    const oldestThread = await getOldestPost(mockSharingForum);
    assert.strictEqual(oldestThread.id, 'th3', 'Thread cũ nhất phải là th3 (timestamp 1785430000000).');
    console.log('✓ Test 2: Đạt!\n');

    // Test 3: Link bài viết không thể mở
    console.log('Test 3: Trả về link hợp lệ...');
    const linkThread = getPostLink(t1_moon);
    assert.strictEqual(linkThread, 'https://discord.com/channels/g1/th1', 'Link thread phải trùng khớp với url của discord.js.');
    console.log('✓ Test 3: Đạt!\n');

    // Test 4: Tìm bài theo tiêu đề và nội dung
    console.log('Test 4: Tìm bài theo tiêu đề và nội dung...');
    const searchResTitle = await searchThreads(mockSharingForum, 'mặt trăng');
    assert.strictEqual(searchResTitle.length, 1, 'Nên tìm thấy đúng 1 thread về mặt trăng.');
    assert.strictEqual(searchResTitle[0].title, 'Tìm hiểu về mặt trăng');

    const searchResContent = await searchThreads(mockSharingForum, 'Turing');
    assert.strictEqual(searchResContent.length, 1, 'Nên tìm thấy thread thảo luận dựa trên nội dung message.');
    assert.strictEqual(searchResContent[0].title, 'Lịch sử phát triển AI');
    console.log('✓ Test 4: Đạt!\n');

    // Test 5: executeDiscordQuery Integration
    console.log('Test 5: Kiểm tra tích hợp executeDiscordQuery...');
    
    // 5a. Mới nhất trong forum chia-sẻ
    const res1 = await executeDiscordQuery(guild, 'bài viết mới nhất trong forum chia-sẻ');
    assert.ok(res1.includes('setup') || res1.includes('Docker'), 'Nên trả về thread mới nhất là Docker setup.');
    assert.ok(res1.includes('https://discord.com/channels/g1/th2'), 'Nên chứa URL thread hợp lệ.');

    // 5b. Cũ nhất trong forum chia-sẻ
    const res2 = await executeDiscordQuery(guild, 'bài viết cũ nhất trong forum chia-sẻ');
    assert.ok(res2.includes('Lịch sử phát triển AI'), 'Nên trả về thread cũ nhất.');
    assert.ok(res2.includes('https://discord.com/channels/g1/th3'), 'Nên chứa URL cũ nhất.');

    // 5c. Tìm bài viết theo từ khóa và trả link mở được
    const res3 = await executeDiscordQuery(guild, 'cho tôi link đến bài viết về mặt trăng trong forum chia-sẻ');
    assert.ok(res3.includes('Tìm hiểu về mặt trăng'), 'Nên tìm thấy bài viết về mặt trăng.');
    assert.ok(res3.includes('https://discord.com/channels/g1/th1'), 'Link phải mở được trực tiếp.');

    // 5d. Test fix lỗi 'trong giáo dục' bị lọc nhầm thành channel
    console.log('5d. Kiểm tra câu hỏi "trong giáo dục" không bị lọc nhầm...');
    // We will simulate a query 'tìm bài viết về AI trong giáo dục'
    // Since there's no actual thread with 'AI trong giáo dục', it should search for 'AI trong giáo dục' and not find it.
    // However, if the bug was active, it would search for 'AI dục'.
    // Let's verify by adding a thread with title 'AI trong giáo dục' to forum and testing!
    const t4_edu = new MockThread('th4', 'AI trong giáo dục', 1785465500000, 'https://discord.com/channels/g1/th4', [
        new MockMessage('th4_m1', 'Ứng dụng AI trong giáo dục và đào tạo thực chiến', 'student_1', 1785465500000, 'https://discord.com/channels/g1/th4/th4_m1')
    ]);
    mockSharingForum.threads.cache.set('th4', t4_edu);
    
    const res4 = await executeDiscordQuery(guild, 'tìm bài viết về AI trong giáo dục trong forum chia-sẻ');
    assert.ok(res4.includes('AI trong giáo dục'), 'Nên tìm đúng bài viết "AI trong giáo dục" thay vì bị cắt thành "AI dục".');
    assert.ok(res4.includes('https://discord.com/channels/g1/th4'), 'Link thread giáo dục phải mở được.');

    console.log('✓ Test 5: Đạt!\n');

    console.log('🎉 TẤT CẢ UNIT TESTS ĐÃ CHẠY VÀ ĐẠT ĐIỂM ĐỐI CHIẾU 100%!');
}

runTests().catch(err => {
    console.error('❌ MỘT SỐ PHẦN TEST BỊ THẤT BẠI:', err);
    process.exit(1);
});
