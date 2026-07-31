/**
 * Helper to fetch a URL with retry logic on 429 Too Many Requests.
 */
async function fetchWithRetry(url, options, retries = 4, delayMs = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.status === 429) {
                console.warn(`⚠️ [AI Service] Gặp lỗi 429 (Too Many Requests). Đang chờ ${delayMs / 1000}s để thử lại lần ${i + 1}/${retries}...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                delayMs *= 2; // Exponential backoff
                continue;
            }
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`⚠️ [AI Service] Lỗi fetch: ${err.message}. Thử lại lần ${i + 1}/${retries}...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            delayMs *= 2; // Exponential backoff
        }
    }
}


/**
 * Helper to call OpenRouter API as primary and Gemini API as fallback.
 * @param {string} systemPrompt 
 * @param {Array} history 
 * @param {string} userMessage 
 * @returns {Promise<string>}
 */
async function callLLM(systemPrompt, history = [], userMessage) {
    if (typeof history === 'string' && userMessage === undefined) {
        userMessage = history;
        history = [];
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. TRY OPENROUTER PRIMARY
    if (openrouterKey) {
        try {
            console.log('⚡ [AI Service] Đang gửi yêu cầu tới OpenRouter API (Primary)...');
            
            const openRouterMessages = [
                { role: 'system', content: systemPrompt },
                ...history.map(msg => ({
                    role: msg.role === 'assistant' ? 'assistant' : msg.role,
                    content: msg.content
                })),
                { role: 'user', content: userMessage }
            ];

            const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openrouterKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://github.com/K4-hackathon-Dis.2-D303',
                    'X-Title': 'Hackathon Discord Bot'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.5-flash',
                    messages: openRouterMessages,
                    max_tokens: 500,
                    temperature: 0.3
                })
            });

            if (response && response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    console.log('✅ [AI Service] OpenRouter phản hồi thành công!');
                    return data.choices[0].message.content;
                }
            }
            
            if (response) {
                console.warn(`⚠️ [AI Service] OpenRouter API trả về status code không mong muốn: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ [AI Service] Lỗi khi gọi OpenRouter API:', error.message);
        }
    } else {
        console.warn('⚠️ [AI Service] Không tìm thấy OPENROUTER_API_KEY trong biến môi trường.');
    }

    // 2. FALLBACK TO DIRECT GEMINI API
    if (geminiKey) {
        try {
            console.log('🔄 [AI Service] ĐANG KÍCH HOẠT FALLBACK GEMINI DIRECT API...');
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`;
            
            const contents = [
                ...history.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                })),
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ];

            const response = await fetchWithRetry(geminiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    generationConfig: {
                        temperature: 0.3
                    }
                })
            });

            if (response && response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                    console.log('✅ [AI Service] Fallback Gemini phản hồi thành công!');
                    return data.candidates[0].content.parts[0].text;
                }
            }

            if (response) {
                console.error(`❌ [AI Service] Fallback Gemini API thất bại với status code: ${response.status}`);
                throw new Error(`Gemini status code ${response.status}`);
            }
            throw new Error('Không nhận được phản hồi từ Gemini API.');
        } catch (error) {
            console.error('❌ [AI Service] Lỗi khi gọi Fallback Gemini API:', error.message);
            throw new Error('Cả hai kênh API (OpenRouter & Gemini) đều thất bại.');
        }
    } else {
        console.warn('⚠️ [AI Service] Không tìm thấy GEMINI_API_KEY trong biến môi trường.');
        throw new Error('OpenRouter thất bại và không cấu hình GEMINI_API_KEY để fallback.');
    }
}

module.exports = {
    callLLM
};
