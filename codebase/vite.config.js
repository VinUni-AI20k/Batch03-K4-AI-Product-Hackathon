import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom plugin to handle logs from frontend and save them to a file
const logPlugin = () => ({
  name: 'log-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/logs' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const logsDir = path.resolve(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
              fs.mkdirSync(logsDir, { recursive: true });
            }
            
            // Generate filename based on current date
            const dateStr = new Date().toISOString().split('T')[0];
            const logFile = path.join(logsDir, `system-${dateStr}.log`);
            
            // Format log entry
            let logData = body;
            try {
              const parsed = JSON.parse(body);
              logData = `[${parsed.level.toUpperCase()}] ${JSON.stringify(parsed.data)}`;
            } catch(e) {}
            
            const logEntry = `[${new Date().toISOString()}] ${logData}\n`;
            
            fs.appendFileSync(logFile, logEntry);
            
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('Error writing log:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to write log' }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), logPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
