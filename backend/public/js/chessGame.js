const socket = io();

const chess = new Chess(); // Create a new Chess instance
const boardelement = document.querySelector('.chessboard');
let dragpiece = null;
let sourcesqure = null;
let playrole = null;

// const renderboard = () => {
//     const board = chess.board(); // Get the board state as a 2D array
//     boardelement.innerHTML = ""; // Clear the board element
//     console.log(board);

//     // Render the board dynamically
//     board.forEach((row, rowIndex) => {
//         row.forEach((squre, squreIndex) => {
//             const squareele = document.createElement('div');
//             squareele.classList.add('square' , 
//                 (rowIndex + squreIndex % 2 === 0 ? "light" : "dark")
//             );
//             squareele.dataset.row = rowIndex;
//             squareele.dataset.col = squreIndex;
//             // squareele.style.width = `${100 / 8}%`;
//             // squareele.style.height = `${100 / 8}%`;

           

//             if (squre) {
//                 const pieceElement = document.createElement('div');
                
//                 pieceElement.classList.add('piece', squre.color === 'w' ? 'white' : 'black');
               
//                 // pieceElement.innerText = piece.type.toUpperCase();
//                 pieceElement.draggable = playrole === squre.color;
//                 pieceElement.addEventListener('dragstart' , (e) => {
//                        if(pieceElement.draggable)
//                        {
//                           dragpiece = pieceElement;
//                           sourcesqure = {row: rowIndex , col: squreIndex};
//                           e.dataTransfer.setData('text/plain' , "")
//                        }

//                 });

//                 pieceElement.addEventListener('dragend' , (e) => {
//                     dragpiece = null;
//                     sourcesqure = null;
//                 });

//               squareele.appendChild(pieceElement);
//             }

//             squareele.addEventListener('dragover' , (e) => {
//                     e.preventDefault();
//             });
            
//             squareele.addEventListener('drop' , (e) => {
//                 e.preventDefault();
//                 if(dragpiece){
//                     const targetsource  = {
//                         row: parseInt(squareele.dataset.row),
//                         col: parseInt(squareele.dataset.col),

//                     }

//                     handlemove(sourcesqure ,targetsource)
//                 }
//             });

//             boardelement.appendChild(squareele);
//         });
//     });
// };

// renderboard(); // Render the chessboard initially



const renderboard = () => {
    const board = chess.board(); // Get the board state as a 2D array
    boardelement.innerHTML = ""; // Clear the board element

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareele = document.createElement('div');
            squareele.classList.add(
                'square',
                (rowIndex + squareIndex) % 2 === 0 ? 'light' : 'dark'
            );
            squareele.dataset.row = rowIndex;
            squareele.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', square.color === 'w' ? 'white' : 'black');

                // Use Unicode characters for pieces
                const pieceSymbols = {
                    p: square.color === 'w' ? '\u2659' : '\u265F', // Pawn
                    r: square.color === 'w' ? '\u2656' : '\u265C', // Rook
                    n: square.color === 'w' ? '\u2658' : '\u265E', // Knight
                    b: square.color === 'w' ? '\u2657' : '\u265D', // Bishop
                    q: square.color === 'w' ? '\u2655' : '\u265B', // Queen
                    k: square.color === 'w' ? '\u2654' : '\u265A', // King
                };
                pieceElement.innerText = pieceSymbols[square.type] || '';
                

               
                pieceElement.draggable = playrole === square.color;
                pieceElement.addEventListener('dragstart', (e) => {
                    if (pieceElement.draggable) {
                        dragpiece = pieceElement;
                        sourcesqure = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData('text/plain', '');
                    }
                });

                pieceElement.addEventListener('dragend', () => {
                    dragpiece = null;
                    sourcesqure = null;
                });

                squareele.appendChild(pieceElement);
            }

            squareele.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            squareele.addEventListener('drop', (e) => {
                e.preventDefault();
                if (dragpiece) {
                    const targetsource = {
                        row: parseInt(squareele.dataset.row),
                        col: parseInt(squareele.dataset.col),
                    };

                    handlemove(sourcesqure, targetsource);
                }
            });

            boardelement.appendChild(squareele);
        });
    });
};


renderboard();



const handlemove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q', // Promoting to queen by default
    };

    // Emit move to the server
    socket.emit("move", move);
};

socket.on("playrole" , function(role) {
    playrole = role;
    renderboard();
})

socket.on('spectatorRole' , function () {
    playrole = null;
    renderboard();
})

socket.on('boardState' , (fen) => {
    chess.load(fen);
    renderboard();
})

socket.on('move' , function(move){
    chess.move(move);
    renderboard();
})

const getpice = () => {

}


