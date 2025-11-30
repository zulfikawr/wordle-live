const { WebcastPushConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8081 });
console.log('Bridge running on 8081');

wss.on('connection', (ws) => {
    let tiktokConnection = null;
    ws.on('message', async (msg) => {
        const data = JSON.parse(msg);
        if (data.type === 'connect') {
            if (tiktokConnection) tiktokConnection.disconnect();
            
            const options = { 
                processInitialData: false, 
                enableExtendedGiftInfo: true,
                sessionId: data.sessionId // Important for bypassing blocks
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
                ws.send(JSON.stringify({type: 'error', message: e.message}));
            }
        }
    });
});