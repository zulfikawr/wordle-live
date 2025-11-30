import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Leaderboard from './components/Leaderboard';
import WinnerOverlay from './components/WinnerOverlay';
import HelpModal from './components/HelpModal';
import ConnectModal from './components/ConnectModal';
import { fetchRandomWord } from './services/gemini';
import { tiktokService } from './services/tiktok';
import { GameStatus, LetterState, RowData, TikTokUser, LeaderboardEntry } from './types';
import confetti from 'canvas-confetti';

// Constants
const ROW_COUNT = 5; // Visual rows
const WORD_LENGTH = 5;

const App: React.FC = () => {
  // --- State ---
  const [secretWord, setSecretWord] = useState('');
  // Grid now stores RowData (tiles + user info)
  const [grid, setGrid] = useState<RowData[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [shakeRow, setShakeRow] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  
  // TikTok Integration State
  const [connectedUser, setConnectedUser] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentWinner, setRecentWinner] = useState<TikTokUser | null>(null);

  // Queue for incoming comments
  const guessQueue = useRef<{user: TikTokUser, word: string}[]>([]);
  const isProcessingQueue = useRef(false);

  // --- Initialization ---

  // Helper to create empty row
  const createEmptyRow = (): RowData => ({
    tiles: Array(WORD_LENGTH).fill(null).map(() => ({ char: '', state: LetterState.INITIAL })),
    user: undefined,
    isCarryOver: false
  });

  const initGame = useCallback(async () => {
    setGameStatus(GameStatus.LOADING);
    setCurrentRow(0);
    setShakeRow(false);
    setRecentWinner(null);
    
    // Create empty grid
    const newGrid: RowData[] = Array(ROW_COUNT).fill(null).map(createEmptyRow);
    setGrid(newGrid);

    // Fetch word
    const word = await fetchRandomWord(WORD_LENGTH);
    setSecretWord(word);
    setGameStatus(GameStatus.PLAYING);
  }, []);

  // Initial load
  useEffect(() => {
    initGame();
  }, [initGame]);

  // --- Game Logic: Process Guess ---

  const processGuess = async (guessWord: string, user: TikTokUser) => {
    if (gameStatus !== GameStatus.PLAYING) return;
    
    const cleanWord = guessWord.toUpperCase().trim();
    if (cleanWord.length !== WORD_LENGTH) return; // Skip invalid length
    if (!/^[A-Z]+$/.test(cleanWord)) return; // Skip non-letters

    // Update Grid with the guess immediately (No typing animation for speed)
    setGrid(prev => {
        const newGrid = [...prev];
        const newRow = { ...newGrid[currentRow] };
        
        // Fill tiles
        newRow.tiles = cleanWord.split('').map(char => ({ char, state: LetterState.INITIAL }));
        newRow.user = user;
        
        // Color logic
        const secretArr = secretWord.split('');
        const guessArr = cleanWord.split('');
        
        // 1. Green
        guessArr.forEach((char, i) => {
            if (char === secretArr[i]) {
                newRow.tiles[i].state = LetterState.CORRECT;
                secretArr[i] = '';
                guessArr[i] = '';
            }
        });

        // 2. Yellow/Gray
        newRow.tiles.forEach((tile, i) => {
            if (tile.state !== LetterState.CORRECT) {
                const indexInSecret = secretArr.indexOf(tile.char);
                if (indexInSecret !== -1) {
                    tile.state = LetterState.PRESENT;
                    secretArr[indexInSecret] = '';
                } else {
                    tile.state = LetterState.ABSENT;
                }
            }
        });

        newGrid[currentRow] = newRow;
        return newGrid;
    });

    // Check Win
    if (cleanWord === secretWord) {
        handleWin(user);
    } else {
        // Move to next row
        if (currentRow < ROW_COUNT - 1) {
            setCurrentRow(prev => prev + 1);
        } else {
            // PAGE TURN LOGIC (Delayed to show 5th row)
            setGameStatus(GameStatus.VALIDATING); // Pauses the queue
            setTimeout(() => {
               turnPage();
               setGameStatus(GameStatus.PLAYING); // Resume queue
            }, 3000); // 3 second delay to read the last guess
        }
    }
  };

  const handleWin = (user: TikTokUser) => {
      setGameStatus(GameStatus.WON);
      setRecentWinner(user);
      
      // Update Leaderboard
      setLeaderboard(prev => {
          const existing = prev.find(e => e.user.uniqueId === user.uniqueId);
          if (existing) {
              return prev.map(e => e.user.uniqueId === user.uniqueId ? { ...e, wins: e.wins + 1 } : e);
          }
          return [...prev, { user, wins: 1 }];
      });

      // Confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#34d399', '#fcd34d', '#f87171', '#60a5fa']
      });

      // Reset after 4 seconds
      setTimeout(() => {
          initGame();
      }, 4000);
  };

  const turnPage = () => {
    setGrid(prevGrid => {
        // 1. Find the best row (Most greens, then yellows)
        let bestScore = -1;
        let bestRowIndex = -1;

        prevGrid.forEach((row, idx) => {
            if (!row.tiles[0].char) return; // Skip empty
            let score = 0;
            row.tiles.forEach(t => {
                if (t.state === LetterState.CORRECT) score += 10;
                if (t.state === LetterState.PRESENT) score += 2;
            });
            if (score > bestScore) {
                bestScore = score;
                bestRowIndex = idx;
            }
        });

        // 2. Create new grid
        const newGrid = Array(ROW_COUNT).fill(null).map(createEmptyRow);
        
        // 3. Move best row to top if exists
        if (bestRowIndex !== -1) {
            newGrid[0] = { ...prevGrid[bestRowIndex], isCarryOver: true };
        }

        return newGrid;
    });
    
    setCurrentRow(1); // Start from second row
  };

  // --- Queue Processor ---
  
  // Simple interval to consume queue
  useEffect(() => {
    const interval = setInterval(() => {
        if (gameStatus !== GameStatus.PLAYING) return;
        if (guessQueue.current.length === 0) return;
        
        const nextGuess = guessQueue.current.shift();
        if (nextGuess) {
            processGuess(nextGuess.word, nextGuess.user);
        }
    }, 1000); // 1 second delay between guesses for readability

    return () => clearInterval(interval);
  }, [gameStatus, currentRow, secretWord]); 

  // --- Connection Handlers ---

  const handleConnectSubmit = (username: string, sessionId: string) => {
      setConnectedUser(username || "Simulation");
      
      tiktokService.connect(username || "demo", sessionId, (user, comment) => {
          // Filter comments: must be 5 letter words
          if (comment.trim().length === WORD_LENGTH) {
              guessQueue.current.push({ user, word: comment });
          }
      });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-orange-50 dark:bg-black text-gray-800 dark:text-white font-sans overflow-x-hidden select-none transition-colors duration-300 flex flex-col lg:flex-row">
        
        {/* Main Game Area */}
        <main className="flex-grow flex flex-col items-center p-4 relative min-h-[100dvh]">
            
            {/* Header */}
            <header className="pt-2 pb-2 text-center w-full relative z-10 flex flex-col items-center">
                <h1 className="text-3xl sm:text-5xl font-black tracking-[0.2em] uppercase">
                WORDLE <span className="text-rose-500">LIVE</span>
                </h1>
                
                {/* Theme Toggle */}
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-white border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none hover:bg-rose-100"
                >
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    )}
                </button>
            </header>

            <Controls 
                status={gameStatus} 
                connectedUser={connectedUser}
                onConnect={() => setIsConnectModalOpen(true)}
                onOpenHelp={() => setIsHelpOpen(true)}
            />
            
            <div className="flex-grow flex flex-col justify-center w-full py-2">
                <Grid 
                    grid={grid} 
                    currentRow={currentRow} 
                    shakeRow={shakeRow} 
                />
            </div>

            {/* Helper Message */}
            <div className="h-12 flex items-center justify-center text-gray-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
                {connectedUser ? `Processing Queue: ${guessQueue.current.length}` : 'Waiting to Connect...'}
            </div>

            {gameStatus === GameStatus.LOADING && (
                <div className="absolute inset-0 flex items-center justify-center bg-orange-50/80 dark:bg-black/80 z-20 backdrop-blur-sm">
                    <div className="animate-spin h-12 w-12 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full"></div>
                </div>
            )}

            <WinnerOverlay winner={recentWinner} word={secretWord} />
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <ConnectModal 
              isOpen={isConnectModalOpen} 
              onClose={() => setIsConnectModalOpen(false)} 
              onConnect={handleConnectSubmit}
            />
        </main>

        {/* Sidebar (Leaderboard) */}
        <aside className="w-full lg:w-80 bg-white/50 dark:bg-neutral-900/50 p-4 lg:border-l-2 lg:border-black dark:lg:border-white flex flex-col flex-shrink-0">
            <Leaderboard entries={leaderboard} />
        </aside>

      </div>
    </div>
  );
};

export default App;