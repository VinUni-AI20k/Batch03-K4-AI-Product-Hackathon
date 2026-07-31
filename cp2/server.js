const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4001;
const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const readHistory = () => {
    try {
        if (!fs.existsSync(HISTORY_FILE)) return {};
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (error) {
        console.warn('Failed to read history file', error);
        return {};
    }
};

const writeHistory = (data) => {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.warn('Failed to write history file', error);
        return false;
    }
};

app.get('/api/logs/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const data = readHistory();
    res.json(data[studentId] || []);
});

app.post('/api/logs/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const logs = req.body.logs || req.body.history || [];
    const data = readHistory();
    data[studentId] = logs;
    if (!writeHistory(data)) {
        return res.status(500).json({ error: 'Could not save history' });
    }
    res.json({ success: true, logs: data[studentId] });
});

app.post('/api/chat', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }
    res.json({ answer: `Mô phỏng trả lời cho: ${prompt.slice(0, 120)}...` });
});

app.listen(PORT, () => {
    console.log(`CP2 backend API listening on http://localhost:${PORT}`);
});
