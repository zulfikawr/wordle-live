import { TikTokUser } from "../types";

// Mock data for simulation
const MOCK_USERS: TikTokUser[] = [
  { uniqueId: 'wordle_king', nickname: 'WordleKing', profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King' },
  { uniqueId: 'guess_master', nickname: 'GuessMaster', profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Master' },
  { uniqueId: 'lucky_charm', nickname: 'LuckyCharm', profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky' },
  { uniqueId: 'speed_runner', nickname: 'SpeedRunner', profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Speed' },
  { uniqueId: 'chat_lurker', nickname: 'ChatLurker', profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lurker' },
];

const MOCK_WORDS = [
  'APPLE', 'BRAIN', 'CRANE', 'DREAM', 'EAGLE', 'FLAME', 'GRAPE', 'HEART', 'IMAGE', 'JUICE',
  'KITE', 'LEMON', 'MOUSE', 'NIGHT', 'OCEAN', 'PIANO', 'QUEEN', 'RIVER', 'SNAKE', 'TIGER'
];

type CommentCallback = (user: TikTokUser, comment: string) => void;

export class TikTokService {
  private isConnected = false;
  private intervalId: any = null;
  private socket: WebSocket | null = null;
  private onComment: CommentCallback | null = null;

  connect(username: string, sessionId: string | null, onComment: CommentCallback) {
    this.onComment = onComment;
    this.isConnected = true;

    // In a real scenario, we would connect to a local Node.js server running tiktok-live-connector
    // For this demo, we will try to connect, but fall back to simulation if it fails.
    this.tryConnectWebSocket(username, sessionId);
  }

  private tryConnectWebSocket(username: string, sessionId: string | null) {
    try {
      // Assuming a local proxy is running on port 8081 (common setup for these tools)
      this.socket = new WebSocket('ws://localhost:8081');
      
      this.socket.onopen = () => {
        console.log('Connected to TikTok Live Proxy');
        this.socket?.send(JSON.stringify({ 
          type: 'connect', 
          username,
          sessionId // Send session ID to server
        }));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat' && this.onComment) {
            this.onComment(
              { uniqueId: data.uniqueId, nickname: data.nickname, profilePictureUrl: data.profilePictureUrl },
              data.comment
            );
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      this.socket.onerror = () => {
        console.log('WebSocket failed, falling back to Simulation Mode');
        this.startSimulation();
      };

    } catch (e) {
      this.startSimulation();
    }
  }

  private startSimulation() {
    // Simulate incoming comments every 1-3 seconds
    if (this.intervalId) clearInterval(this.intervalId);
    
    this.intervalId = setInterval(() => {
      if (!this.isConnected || !this.onComment) return;

      const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const randomWord = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
      
      this.onComment(randomUser, randomWord);
    }, 2000);
  }

  disconnect() {
    this.isConnected = false;
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.socket) this.socket.close();
  }
}

export const tiktokService = new TikTokService();