const board = document.querySelector('.board');
const playBuutton = document.getElementById("play-btn");
const pauseBuutton = document.getElementById("pause-btn");
const restartBuutton = document.getElementById("restart-btn");
const modal = document.getElementById("modal");
const startmodal = document.getElementById("startmodal");
const startBtn = document.getElementById('start-btn');
const closeModal = document.querySelector('.close-modal')

const gamescore = document.querySelector('.game-score');

const blockWidth = 30;
const blockHeight = 30;
const columns = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let speed = 150;
let intervalClearing = null;
let score = 0;
let food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) };
let blocks = {};
let snake = [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }];
let direction = 'right';
let head = null;

// CREATE GRID
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${col}-${row}`] = block;
    }
}

// CONTROL MOVEMENT
function Movement() {
    if (direction === 'up') head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === 'down') head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === 'left') head = { x: snake[0].x - 1, y: snake[0].y };
    else if (direction === 'right') head = { x: snake[0].x + 1, y: snake[0].y };
}

// RENDER SNAKE
function render() {
    blocks[`${food.x}-${food.y}`].classList.add('food');

    Movement();

    snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.remove("fill"));

    // GAME OVER
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
        modal.style.display = 'flex';
        clearInterval(intervalClearing);
        return;
    }

    // EAT FOOD
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) };
        snake.unshift(head);
        score++;
        gamescore.innerText = score;
    } else {
        snake.pop();
        snake.unshift(head);
    }

    snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.add("fill"));
}

// INTERVAL CONTROL
function resetInterval() {
    clearInterval(intervalClearing);
    intervalClearing = setInterval(render, speed);
}

// START GAME FROM MODAL
startBtn.addEventListener('click', () => {
    startmodal.style.display = 'none';
    resetInterval();
    playBuutton.style.display = "none";
    pauseBuutton.style.display = "block";
});


// PLAY / PAUSE BUTTONS
playBuutton.addEventListener("click", () => { resetInterval(); playBuutton.style.display = "none"; pauseBuutton.style.display = "block"; });
pauseBuutton.addEventListener("click", () => { clearInterval(intervalClearing); playBuutton.style.display = "block"; pauseBuutton.style.display = "none"; });

// RESTART BUTTON
restartBuutton.addEventListener("click", restartGame);

function restartGame() {
    modal.style.display = 'none';
    score = 0;
    gamescore.innerText = score;

    // CLEAR SNAKE AND FOOD
    snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.remove("fill"));
    blocks[`${food.x}-${food.y}`].classList.remove('food');

    // RESET POSITIONS
    snake = [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }];
    food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) };
    direction = 'right';

    snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.add("fill"));
    blocks[`${food.x}-${food.y}`].classList.add('food');


    resetInterval();
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';

})

// KEYBOARD CONTROL
addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});
