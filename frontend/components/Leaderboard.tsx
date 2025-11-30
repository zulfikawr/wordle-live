import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => b.wins - a.wins);

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-4 flex flex-col gap-4">
      <h2 className="text-xl font-black uppercase tracking-widest text-center border-b-2 border-black dark:border-white pb-2">
        Leaderboard
      </h2>
      
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] lg:max-h-[500px]">
        {sortedEntries.length === 0 ? (
          <p className="text-center text-sm text-gray-400 italic py-4">Waiting for winners...</p>
        ) : (
          sortedEntries.map((entry, index) => (
            <div key={entry.user.uniqueId} className="flex items-center justify-between bg-gray-50 dark:bg-black p-2 border border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-gray-400 w-4 text-sm">{index + 1}</span>
                <img src={entry.user.profilePictureUrl} alt={entry.user.nickname} className="w-6 h-6 rounded-full bg-gray-200" />
                <span className="text-sm font-bold truncate max-w-[100px]">{entry.user.nickname}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-black text-emerald-500">{entry.wins}</span>
                <span className="text-[10px] uppercase text-gray-400">Wins</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
