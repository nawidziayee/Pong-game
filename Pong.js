const canvas = document.querySelector("#gameBoard");
const ctx = canvas.getContext("2d");

const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const startScreen = document.querySelector("#startScreen");
const startBtn = document.querySelector("#startBtn");
const difficultySelect = document.querySelector("#difficulty");
const modeSelect = document.querySelector("#mode");

const hitSound = document.querySelector("#hitSound");
const scoreSound = document.querySelector("#scoreSound");
const startSound = document.querySelector("#startSound");

const gameWidth = canvas.width;
const gameHeight = canvas.height;

const paddleSpeed = 40;
const ballRadius = 10;

let ballX, ballY, ballDX, ballDY;
let player1Score = 0;
let player2Score = 0;
let gameRunning = false;
let aiSpeed = 3;
let gameMode = "single";

const paddle1 = { x: 10, y: 100, width: 15, height: 100 };
const paddle2 = { x: gameWidth - 25, y: 100, width: 15, height: 100 };

window.addEventListener("keydown", movePlayers);
resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", startGameFromMenu);

function startGameFromMenu(){
    startSound.play();
    gameMode = modeSelect.value;
    setDifficulty();
    startScreen.style.display = "none";
    gameRunning = true;
    resetGame();
    requestAnimationFrame(gameLoop); 
}


function setDifficulty(){
    const level = difficultySelect.value;
    if(level === "easy") aiSpeed = 2;
    if(level === "medium") aiSpeed = 4;
    if(level === "insane") aiSpeed = 7;
}

function resetGame(){
    player1Score = 0;
    player2Score = 0;
    paddle1.y = gameHeight/2 - 50;
    paddle2.y = gameHeight/2 - 50;
    updateScore();
    createBall();
}


function createBall(){
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballDX = Math.random() > 0.5 ? 3 : -3;
    ballDY = Math.random() > 0.5 ? 3 : -3;
}

function gameLoop(){
    if(!gameRunning) return;
    clearBoard();
    moveBall();
    moveAI();
    drawPaddles();
    drawBall();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

function clearBoard(){
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles(){
    ctx.fillStyle = "lightblue";
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = "red";
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function drawBall(){
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fill();
}

function moveBall(){
    ballX += ballDX;
    ballY += ballDY;
}

function movePlayers(e){
    const key = e.keyCode;

    // Player 1 (W,S)
    if(key === 87 && paddle1.y > 0) paddle1.y -= paddleSpeed;
    if(key === 83 && paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;

    // Player 2 only if multiplayer
    if(gameMode === "multi"){
        if(key === 38 && paddle2.y > 0) paddle2.y -= paddleSpeed;
        if(key === 40 && paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
    }
}

function moveAI(){
    if(gameMode !== "single") return;

    if(paddle2.y + paddle2.height/2 < ballY) paddle2.y += aiSpeed;
    else paddle2.y -= aiSpeed;

    if(paddle2.y < 0) paddle2.y = 0;
    if(paddle2.y > gameHeight - paddle2.height) paddle2.y = gameHeight - paddle2.height;
}

function checkCollision(){
    // Wall bounce
    if(ballY <= ballRadius || ballY >= gameHeight - ballRadius){
        ballDY *= -1;
    }

    // Paddle 1
    if(ballX <= paddle1.x + paddle1.width &&
       ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
        ballDX *= -1;
        hitSound.play();
    }

    // Paddle 2
    if(ballX >= paddle2.x &&
       ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
        ballDX *= -1;
        hitSound.play();
    }

    // Score
    if(ballX < 0){
        player2Score++;
        scoreSound.play();
        updateScore();
        createBall();
    }

    if(ballX > gameWidth){
        player1Score++;
        scoreSound.play();
        updateScore();
        createBall();
    }
}

function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}
