export enum LetterState {
  INITIAL = 'initial',
  CORRECT = 'correct', // Green
  PRESENT = 'present', // Yellow
  ABSENT = 'absent',   // Gray
}

export interface TileData {
  char: string;
  state: LetterState;
}

export type GridData = TileData[][];

export enum GameStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  VALIDATING = 'validating',
  WON = 'won',
  LOST = 'lost', // Not used much in infinite mode
}

export interface TikTokUser {
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface GameGuess {
  word: string;
  user: TikTokUser;
  isCarryOver?: boolean; // If this row was carried over from previous page
}

export interface RowData {
  tiles: TileData[];
  user?: TikTokUser;
  isCarryOver?: boolean;
}

export interface LeaderboardEntry {
  user: TikTokUser;
  wins: number;
}
