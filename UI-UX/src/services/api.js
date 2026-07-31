const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4001';

export async function getHistoryForStudent(studentId) {
    try {
        const res = await fetch(`${API_BASE}/api/logs/${encodeURIComponent(studentId)}`);
        if (!res.ok) {
            return [];
        }
        return res.json();
    } catch (error) {
        console.warn('Could not fetch history from backend', error);
        return [];
    }
}

export async function saveHistoryForStudent(studentId, logs) {
    try {
        const res = await fetch(`${API_BASE}/api/logs/${encodeURIComponent(studentId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logs }),
        });
        return res.ok;
    } catch (error) {
        console.warn('Could not save history to backend', error);
        return false;
    }
}
