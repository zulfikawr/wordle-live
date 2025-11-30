// index.js
const http = require('http');
const { WebcastPushConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8081;

// Basic HTTP server (for health checks / root)
const server = http.createServer((_req, res) => {
    res.writeHead(200);
    res.end('TikTok bridge is running');
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

console.log('Starting bridge...');

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    let tiktokConnection = null;

    ws.on('message', async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === 'connect') {
            // Disconnect previous stream if any
            if (tiktokConnection) {
                tiktokConnection.disconnect();
                tiktokConnection = null;
            }

            const options = { 
                processInitialData: false, 
                enableExtendedGiftInfo: true,
                sessionId: data.sessionId // from client
            };

            tiktokConnection = new WebcastPushConnection(data.username, options);

            try {
                await tiktokConnection.connect();
                console.log('Connected to ' + data.username);

                tiktokConnection.on('chat', (chat) => {
                    ws.send(JSON.stringify({
                        type: 'chat', 
                        uniqueId: chat.uniqueId,
                        nickname: chat.nickname, 
                        profilePictureUrl: chat.profilePictureUrl, 
                        comment: chat.comment
                    }));
                });

            } catch (e) { 
                console.error(e.message); 
                ws.send(JSON.stringify({ type: 'error', message: e.message }));
            }
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        if (tiktokConnection) {
            tiktokConnection.disconnect();
            tiktokConnection = null;
        }
    });
});

server.listen(PORT, () => {
    console.log('Bridge running on port ' + PORT);
});
