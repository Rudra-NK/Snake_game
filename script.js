const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const box = 20; // grid size
let score = 0;

// Snake starting position
let snake = [{ x: 9 * box, y: 10 * box }];

// Food position
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

let d; // direction

// Keyboard controls
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode === 37 && d !== "RIGHT") d = "LEFT";
    else if (event.keyCode === 38 && d !== "DOWN") d = "UP";
    else if (event.keyCode === 39 && d !== "LEFT") d = "RIGHT";
    else if (event.keyCode === 40 && d !== "UP") d = "DOWN";
}

// Mouse/Touch button controls
document.getElementById("up").addEventListener("click", () => {
    if (d !== "DOWN") d = "UP";
});
document.getElementById("down").addEventListener("click", () => {
    if (d !== "UP") d = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
    if (d !== "RIGHT") d = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
    if (d !== "LEFT") d = "RIGHT";
});

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ff00" : "lime";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Snake movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreEl.innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game over check
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
        return;
    }

    snake.unshift(newHead);
}

// Run the game every 100ms
let game = setInterval(draw, 100);
