const words = ["table", "chair", "piano", "mouse", "house", "plant", "brain", "cloud", "beach", "fruit"];

const randomIndex = Math.floor(Math.random() * words.length);
let targetWord = words[randomIndex];

console.log(targetWord);

let attempts = 0;
const maxAttempts = 6;

const board = document.getElementById("board");

for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}

document.getElementById("guessButton").addEventListener("click", function() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toLowerCase();

    if (guess.length !== 5) {
        showMessage("Please enter a 5-letter word!");
        return;
    }

    if (!/^[a-zA-Z]+$/.test(guess)) {
        showMessage("Only letters allowed!");
        return;
    }

    const cells = document.querySelectorAll(".cell");
    const startIndex = attempts * 5;

    let targetLetterCounts = {};
    for (let char of targetWord) {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
    }

    let cellStates = ["red", "red", "red", "red", "red"];

    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        if (letter === targetWord[i]) {
            cellStates[i] = "green";
            targetLetterCounts[letter]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        if (cellStates[i] !== "green") {
            if (targetWord.includes(letter) && targetLetterCounts[letter] > 0) {
                cellStates[i] = "yellow";
                targetLetterCounts[letter]--;
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const cell = cells[startIndex + i];
            cell.textContent = guess[i];
            cell.classList.add("flip");
            cell.classList.add(cellStates[i]);
            cell.style.borderColor = "transparent"; 
        }, i * 300);
    }

    attempts++;
    input.value = "";

    setTimeout(() => {
        if (guess === targetWord) {
            alert("You won!");
            disableGame();
        } else if (attempts === maxAttempts) {
            alert("Game Over! The word was: " + targetWord.toUpperCase());
            disableGame();
        }
    }, 1600);
});

function disableGame() {
    document.getElementById("guessInput").disabled = true;
    document.getElementById("guessButton").disabled = true;
    document.getElementById("restartButton").style.display = "inline-block";
}

function showMessage(msg) {
    const messageContainer = document.getElementById("message-container");
    messageContainer.textContent = msg;
    setTimeout(() => {
        messageContainer.textContent = "";
    }, 3000);
}

document.getElementById("guessInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("guessButton").click();
    }
});

document.getElementById("restartButton").addEventListener("click", function() {
    attempts = 0;
    const randomIndex = Math.floor(Math.random() * words.length);
    targetWord = words[randomIndex];
    console.log(targetWord);

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell";
        cell.style.borderColor = "lightgray";
        cell.style.animation = "none";
    });

    document.getElementById("guessInput").disabled = false;
    document.getElementById("guessInput").value = "";
    document.getElementById("guessButton").disabled = false;
    document.getElementById("restartButton").style.display = "none";
});