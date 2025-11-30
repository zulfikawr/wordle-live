import React from 'react';
import Tile from './Tile';
import { RowData } from '../types';

interface GridProps {
  grid: RowData[];
  currentRow: number;
  shakeRow: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, currentRow, shakeRow }) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-4 w-full max-w-xl transition-all">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="relative flex items-center justify-center">
          
          {/* User Info 
              Mobile: Relative positioning (part of flow) to ensure visibility
              Desktop (sm+): Absolute positioning to 'hang' off the side 
          */}
          <div className={`
            flex items-center gap-2 transition-opacity duration-300
            mr-2 sm:mr-0 sm:absolute sm:left-0 sm:-translate-x-full sm:pr-4
            ${row.user || row.isCarryOver ? 'opacity-100' : 'opacity-0'}
          `}>
             <div className="flex flex-col items-end">
                {/* Hide nickname on very small screens if needed, or keep it responsive */}
                <span className="hidden xs:block sm:block text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 text-right max-w-[60px] sm:max-w-[80px] truncate">
                  {row.user?.nickname}
                </span>
                {row.isCarryOver && (
                   <span className="text-[8px] sm:text-[9px] uppercase font-black text-amber-500 tracking-wider leading-none">
                     Best
                   </span>
                )}
             </div>
             
             <div className="relative flex-shrink-0">
                <img 
                  src={row.user?.profilePictureUrl} 
                  alt="avatar" 
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 shadow-sm ${
                    row.isCarryOver 
                      ? 'border-amber-400 dark:border-amber-400' 
                      : 'border-white dark:border-neutral-700'
                  }`}
                />
                {row.isCarryOver && (
                  <div className="absolute -top-2 -right-1 bg-amber-400 text-white rounded-full p-[2px] border border-white dark:border-black">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2 h-2">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
             </div>
          </div>

          {/* Tiles */}
          <div 
            className={`flex gap-1.5 sm:gap-3 justify-center ${
              rowIndex === currentRow && shakeRow ? 'animate-shake' : ''
            }`}
          >
            {row.tiles.map((tile, colIndex) => (
              <Tile 
                key={colIndex} 
                data={tile} 
                index={colIndex}
                isRevealed={tile.char !== '' && (rowIndex < currentRow || row.isCarryOver || rowIndex === currentRow)} 
              />
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default Grid;