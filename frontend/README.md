# Wordle Live

A Wordle clone designed for **TikTok Live streaming**. The application connects to a TikTok Live stream, reads viewer comments, and treats 5-letter comments as guesses in the game.

Powered by Google Gemini for dynamic word generation.

## Features

- **Infinite Continuous Play**: The game never ends. When 5 guesses are made, the "best" guess carries over to the next page, allowing for infinite collaboration.
- **TikTok Live Integration**: Real-time comment fetching via a local WebSocket bridge.
- **Gemini AI**: Generates random common English nouns on the fly.
- **Leaderboard**: Tracks users who correctly guess the word.
- **Responsive 3D UI**: Satisfying flip animations, pop effects, and mobile-friendly design.
- **Dark/Light Mode**: Full theme support.

## Setup & Installation

This project requires a small Node.js server to bridge the gap between the browser and TikTok's servers.

### 1. Prerequisites
- Node.js installed on your machine.
- A Gemini API Key (set in your environment as `API_KEY`).

### 2. Install Dependencies
This project uses standard React dependencies. If running locally:
```bash
npm install
```

### 3. Running the Bridge Server
To connect to real TikTok comments, you must run the included `server.js` script.

1. Create a folder for the server (or use the root if running locally).
2. Install the required libraries:
   ```bash
   npm install tiktok-live-connector ws
   ```
3. Run the server:
   ```bash
   node server.js
   ```
   The terminal should say: `TikTok Live Bridge Server running on port 8081`.

### 4. Running the App
Start the web application.
1. Click the **CONNECT TIKTOK LIVE** button.
2. Enter the TikTok `@username` of the account currently streaming.
3. If you encounter connection errors (e.g., SIGI_STATE), you may need to provide a `Session ID` (see Help within the app for details).

## How to Play

1. **Host**: Runs the web app on their screen/stream.
2. **Viewers**: Type 5-letter words in the TikTok chat (e.g., "APPLE", "BEACH").
3. **The Game**:
   - The app reads comments.
   - It validates the length (must be 5 letters).
   - It inputs them into the grid.
   - If a viewer guesses correctly, they win, get confetti, and are added to the leaderboard!

## Technologies

- React + TypeScript
- Tailwind CSS
- Google GenAI SDK (Gemini)
- Canvas Confetti
- TikTok Live Connector (via WebSocket)
