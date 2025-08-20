const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const retryBtn = document.getElementById("retry");

const box = 20; 
let snake, food, d, score, game;

function initGame() {
  
  snake = [{ x: 9 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
  d = null;
  score = 0;
  scoreEl.innerText = "Score: 0";
  retryBtn.classList.add("hidden");

  clearInterval(game);
  game = setInterval(draw, 170); 
}

document.addEventListener("keydown", direction);
function direction(event) {
  if (event.keyCode === 37 && d !== "RIGHT") d = "LEFT";
  else if (event.keyCode === 38 && d !== "DOWN") d = "UP";
  else if (event.keyCode === 39 && d !== "LEFT") d = "RIGHT";
  else if (event.keyCode === 40 && d !== "UP") d = "DOWN";
}

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

retryBtn.addEventListener("click", initGame);

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#5f0fffff" : "#0fefffff";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#ff008cff";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

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

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX > canvas.width - (box - 1 ) ||
    snakeY > canvas.height - (box - 1 ) ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    retryBtn.classList.remove("hidden");
    return;
  }

  snake.unshift(newHead);
}

initGame();
