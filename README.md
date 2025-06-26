## Live Demo: https://chess-game-jzc8.onrender.com/

-	An online real-time two-player chess game built using Node.js, Express, Socket.io, and EJS.
- Designed for fun, learning, and live gameplay with friends.

   

## Features
- ♟️ Two-player mode (real-time)
- ✅ The game always starts with the white player
- ⚫ Once the game starts, the same player cannot play both sides
- ⏳ Any other user can view the game live but cannot make moves
- 🔄 Real-time move synchronization using Socket.IO
- 🧠 Basic rules of chess implemented using chess.js





## Tech Stack
- Backend: Node.js + Express.js
- Frontend: EJS templates + Vanilla JS
- WebSockets: Socket.IO for real-time communication
- Logic: chess.js library for chess rules and validations








   
  

## How It Works
- First player (white) opens the game and starts playing.
- A second player (black) can then join and start playing as the opponent.
- Only two players can control the game — all others become spectators.
- Moves are validated and synced in real-time using Socket.io.

