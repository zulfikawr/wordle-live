import React from 'react';
import { TikTokUser } from '../types';

interface WinnerOverlayProps {
  winner: TikTokUser | null;
  word: string;
}

const WinnerOverlay: React.FC<WinnerOverlayProps> = ({ winner, word }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 absolute inset-0 backdrop-blur-sm animate-pop"></div>
      <div className="relative bg-white dark:bg-black border-4 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center gap-6 max-w-sm w-full animate-pop">
        
        <div className="absolute -top-6 bg-yellow-400 text-black font-black px-4 py-1 text-sm uppercase tracking-widest border-2 border-black transform -rotate-2">
          Correct Guess!
        </div>

        <img 
          src={winner.profilePictureUrl} 
          alt={winner.nickname} 
          className="w-24 h-24 rounded-full border-4 border-black dark:border-white"
        />
        
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase mb-1">{winner.nickname}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">@{winner.uniqueId}</p>
        </div>

        <div className="w-full h-px bg-gray-200 dark:bg-neutral-800"></div>

        <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">The word was</p>
            <p className="text-4xl font-black text-emerald-500 tracking-widest">{word}</p>
        </div>

      </div>
    </div>
  );
};

export default WinnerOverlay;
