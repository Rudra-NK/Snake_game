const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const retryBtn = document.getElementById("retry");

const box = 20; // grid size
let snake, food, d, score, game, speed;

function initGame() {
    // Reset variables
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    d = null;
    score = 0;
    speed = 160; // start slow
    scoreEl.innerText = "Score: 0";
    retryBtn.classList.add("hidden");

    // Start game loop
    clearInterval(game);
    game = setInterval(draw, speed);
}

// Keyboard controls
document.addEventListener("keydown", direction);
function direction(event) {
    if (event.keyCode === 37 && d !== "RIGHT") d = "LEFT";
    else if (event.keyCode === 38 && d !== "DOWN") d = "UP";
    else if (event.keyCode === 39 && d !== "LEFT") d = "RIGHT";
    else if (event.keyCode === 40 && d !== "UP") d = "DOWN";
}

// Button controls
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

// Retry button event
retryBtn.addEventListener("click", initGame);

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function updateSpeed() {
    // From score 0 → 20, speed goes 160 → 80
    // After score 20, stays at max speed (80)
    let newSpeed = 160 - Math.min(score, 20) * 4;
    if (newSpeed !== speed) {
        speed = newSpeed;
        clearInterval(game);
        game = setInterval(draw, speed);
    }
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

        // Generate new food
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };

        // ✅ Speed up gradually
        updateSpeed();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Wall & self collision
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX > canvas.width - box ||
        snakeY > canvas.height - box ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        retryBtn.classList.remove("hidden"); // Show retry button
        return;
    }

    snake.unshift(newHead);
}

// Start the game first time
initGame();
