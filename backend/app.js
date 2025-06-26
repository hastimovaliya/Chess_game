const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js'); // Ensure this module is installed
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {}; // Track white and black players
let currentTurn = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index route
app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Assign roles: white, black, or spectator
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playrole", "w");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playrole", "b");
    } else {
        socket.emit("spectatorRole");
    }

    // Send the initial board state
    socket.emit("boardState", chess.fen());

    // Handle player disconnects
    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            delete players.white;
        } else if (socket.id === players.black) {
            delete players.black;
        }
        console.log("A user disconnected:", socket.id);
    });

    // Handle move events
    socket.on("move", (move) => {
        try {
            // Validate turn
            if (chess.turn() === 'w' && socket.id !== players.white) return;
            if (chess.turn() === 'b' && socket.id !== players.black) return;

            // Attempt the move
            const result = chess.move(move);
            if (result) {
                currentTurn = chess.turn();
                io.emit("move", move); // Notify all clients of the move
                io.emit("boardState", chess.fen()); // Send updated board state
            } else {
                console.log("Invalid move:", move);
                socket.emit("invalidMove", move);
            }
        } catch (error) {
            console.error("Error handling move:", error);
            socket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
