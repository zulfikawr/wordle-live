import React from 'react';
import { GameStatus } from '../types';

interface ControlsProps {
  status: GameStatus;
  connectedUser: string | null;
  onConnect: () => void;
  onOpenHelp: () => void;
}

const Controls: React.FC<ControlsProps> = ({ status, connectedUser, onConnect, onOpenHelp }) => {
  return (
    <div className="flex justify-center items-center gap-2 w-full px-4 py-2 mb-4">
      
      {!connectedUser ? (
        <>
          <button 
            onClick={onConnect}
            type="button"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-y-[3px] active:translate-x-[3px] transition-all uppercase tracking-widest flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
            </svg>
            Connect TikTok Live
          </button>
          
          <button 
            onClick={onOpenHelp}
            className="bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-800 dark:text-white font-bold w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-y-[3px] active:translate-x-[3px] transition-all"
            title="How to connect?"
          >
            ?
          </button>
        </>
      ) : (
         <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded border border-green-500 text-green-700 dark:text-green-400 font-bold text-sm uppercase tracking-wide">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Listening to @{connectedUser}
         </div>
      )}
    </div>
  );
};

export default Controls;