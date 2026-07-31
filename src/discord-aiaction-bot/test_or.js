const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


async function testOR() {
    const key = process.env.OPENROUTER_API_KEY;
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 500
        })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
}
testOR();
