import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-neutral-900 border-2 border-black dark:border-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black uppercase tracking-widest text-rose-500">How to Connect Real TikTok</h2>
          <button onClick={onClose} className="text-xl font-bold hover:text-rose-500">&times;</button>
        </div>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            To connect this web app to real TikTok Live comments, you need to run a small "bridge" server on your computer.
          </p>

          <div className="bg-red-50 dark:bg-red-900/30 p-4 border-l-4 border-red-500">
             <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">Error: "Failed to extract SIGI_STATE"?</h3>
             <p className="mb-2">If you see this error in your terminal, TikTok is blocking the connection. You need a <b>Session ID</b>.</p>
             <ol className="list-decimal pl-5 space-y-1">
                 <li>Open <b>TikTok.com</b> in your browser and log in.</li>
                 <li>Right-click page → <b>Inspect</b> → Go to <b>Application</b> tab (or Storage).</li>
                 <li>Expand <b>Cookies</b> → Click <b>https://www.tiktok.com</b>.</li>
                 <li>Find the cookie named <b>sessionid</b> and copy its Value.</li>
                 <li>Paste this value when the website asks for "Session ID".</li>
             </ol>
          </div>

          <div className="bg-blue-50 dark:bg-neutral-800 p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Step 1: Install Node.js</h3>
            <p>Make sure you have Node.js installed on your computer.</p>
          </div>

          <div className="bg-blue-50 dark:bg-neutral-800 p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Step 2: Create Project</h3>
            <p className="mb-2">Create a new folder on your computer, open a terminal there, and run:</p>
            <code className="block bg-black text-green-400 p-2 rounded mb-2 select-all">
              npm install tiktok-live-connector ws
            </code>
          </div>

          <div className="bg-blue-50 dark:bg-neutral-800 p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Step 3: Create Server Script</h3>
            <p className="mb-2">Create a file named <b>server.js</b> and paste this code:</p>
            <textarea 
              readOnly 
              className="w-full h-32 bg-black text-gray-300 p-2 text-xs font-mono rounded resize-y focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={`const { WebcastPushConnection } = require('tiktok-live-connector');
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
});`}
            />
          </div>

          <div className="bg-blue-50 dark:bg-neutral-800 p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Step 4: Run & Connect</h3>
            <ul className="list-decimal pl-5 space-y-1">
              <li>Run <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">node server.js</code> in your terminal.</li>
              <li>Click the <b>CONNECT TIKTOK LIVE</b> button on this website.</li>
              <li>Enter username. If you get connection errors, enter the <b>Session ID</b>.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-6 hover:opacity-80 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;