const selectBox = document.querySelector(".select-box"),
      selectBtnX = selectBox.querySelector(".options .playerX"),
      selectBtnO = selectBox.querySelector(".options .playerO"),
      playBoard = document.querySelector(".play-board"),
      players = document.querySelector(".players"),
      allBox = document.querySelectorAll("section span"),
      resultBox = document.querySelector(".result-box"),
      wonText = resultBox.querySelector(".won-text"),
      replayBtn = resultBox.querySelector(".replay"),
      quitBtn = resultBox.querySelector(".quit"); // Select Quit Button

window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
}

selectBtnO.onclick = () => { 
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
}

let playerXIcon = "fas fa-times",
    playerOIcon = "far fa-circle",
    playerSign = "X",
    runBot = true;

function clickedBox(element) {
    if (players.classList.contains("player")) {
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", playerSign);
        players.classList.add("active");
    }
    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";
    if (runBot) {
        let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
        setTimeout(() => {
            bot();
        }, randomTimeDelay);
    }
}
let scoreX = 0, scoreO = 0, draws = 0;

function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) ||
        checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) ||
        checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        
        runBot = false;
        bot();
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            if (playerSign === "X") {
                scoreX++;
                document.getElementById("scoreX").textContent = scoreX;
            } else {
                scoreO++;
                document.getElementById("scoreO").textContent = scoreO;
            }
            wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
        }, 700);

    } else if (!isMovesLeft()) {
        runBot = false;
        bot();
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            draws++;
            document.getElementById("draws").textContent = draws;
            wonText.textContent = "Match has been drawn!";
        }, 700);
    }
}

function bot() {
    if (!runBot) return;

    let bestMove = getBestMove();
    if (bestMove !== null) {
        if (players.classList.contains("player")) {
            playerSign = "X";
            allBox[bestMove].innerHTML = `<i class="${playerXIcon}"></i>`;
            allBox[bestMove].setAttribute("id", playerSign);
            players.classList.add("active");
        } else {
            playerSign = "O";
            allBox[bestMove].innerHTML = `<i class="${playerOIcon}"></i>`;
            allBox[bestMove].setAttribute("id", playerSign);
        }
        selectWinner();
        allBox[bestMove].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";
    }
}

function getBestMove() {
    let bestVal = -Infinity;
    let bestMove = null;

    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].childElementCount === 0) {
            allBox[i].innerHTML = `<i class="${playerXIcon}"></i>`;
            allBox[i].setAttribute("id", "X");
            let moveVal = minimax(0, false);
            allBox[i].innerHTML = "";
            allBox[i].setAttribute("id", "");
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(depth, isMax) {
    let score = evaluate();
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isMovesLeft() === false) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount === 0) {
                allBox[i].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[i].setAttribute("id", "X");
                best = Math.max(best, minimax(depth + 1, !isMax));
                allBox[i].innerHTML = "";
                allBox[i].setAttribute("id", "");
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount === 0) {
                allBox[i].innerHTML = `<i class="${playerOIcon}"></i>`;
                allBox[i].setAttribute("id", "O");
                best = Math.min(best, minimax(depth + 1, !isMax));
                allBox[i].innerHTML = "";
                allBox[i].setAttribute("id", "");
            }
        }
        return best;
    }
}

function evaluate() {
    // Check rows, columns and diagonals for a winner
    for (let i = 0; i < 3; i++) {
        if (getIdVal(1 + i * 3) === getIdVal(2 + i * 3) && getIdVal(2 + i * 3) === getIdVal(3 + i * 3)) {
            if (getIdVal(1 + i * 3) === "X") return 10;
            if (getIdVal(1 + i * 3) === "O") return -10;
        }
        if (getIdVal(1 + i) === getIdVal(4 + i) && getIdVal(4 + i) === getIdVal(7 + i)) {
            if (getIdVal(1 + i) === "X") return 10;
            if (getIdVal(1 + i) === "O") return -10;
        }
    }
    if (getIdVal(1) === getIdVal(5) && getIdVal(5) === getIdVal(9)) {
        if (getIdVal(1) === "X") return 10;
        if (getIdVal(1) === "O") return -10;
    }
    if (getIdVal(3) === getIdVal(5) && getIdVal(5) === getIdVal(7)) {
        if (getIdVal(3) === "X") return 10;
        if (getIdVal(3) === "O") return -10;
    }
    return 0;
}

function isMovesLeft() {
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].childElementCount === 0) return true;
    }
    return false;
}

function getIdVal(index) {
    return document.querySelector(".box" + index).id;
}

function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) === sign && getIdVal(val2) === sign && getIdVal(val3) === sign) {
        return true;
    }
}

function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) ||
        checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) ||
        checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false;
        bot();
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
    } else if (!isMovesLeft()) {
        runBot = false;
        bot();
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.textContent = "Match has been drawn!";
    }
}

replayBtn.onclick = () => {
    window.location.reload();
}

// Quit Button Functionality
quitBtn.onclick = () => {
    allBox.forEach(box => {
        box.innerHTML = "";  // Clear X and O icons
        box.removeAttribute("id");  // Clear ids
        box.style.pointerEvents = "auto";  // Enable clicking
        
    });
    
}
