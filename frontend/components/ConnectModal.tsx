import React, { useState } from 'react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (username: string, sessionId: string) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onConnect(username, sessionId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-neutral-900 border-2 border-black dark:border-white w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 animate-pop">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-rose-500">Connect to Live</h2>
          <button onClick={onClose} className="text-2xl leading-none font-bold hover:text-rose-500">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
              TikTok Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full bg-gray-50 dark:bg-black border-2 border-black dark:border-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
              Session ID <span className="text-gray-400 font-normal normal-case">(Optional, fix for "SIGI_STATE")</span>
            </label>
            <input 
              type="text" 
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Paste sessionid cookie here..."
              className="w-full bg-gray-50 dark:bg-black border-2 border-black dark:border-white p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-bold uppercase tracking-wider border-2 border-transparent hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-rose-500 text-white py-3 font-bold uppercase tracking-wider border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectModal;