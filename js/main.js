const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let lastTime = 0;
let fpsInterval = 1000 / 15; // Set the FPS to 15
let gameStarted = false;
let gameOver = false;

const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

upButton.addEventListener("click", () => snake.changeDirection('Up'));
downButton.addEventListener("click", () => snake.changeDirection('Down'));
leftButton.addEventListener("click", () => snake.changeDirection('Left'));
rightButton.addEventListener("click", () => snake.changeDirection('Right'));

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
    // Đặt lại các giá trị game
    snake = new Snake(scale, canvas.width, canvas.height);
    fruit = new Fruit(scale, rows, columns);
    fruit.pickLocation();

    // Ẩn màn hình bắt đầu và kết thúc khi bắt đầu lại game
    startScreen.classList.add("hidden");
    endScreen.classList.add("hidden");  // Ẩn màn hình kết thúc
    gameStarted = true;
    gameOver = false;  // Đặt gameOver là false khi khởi động lại game
    window.requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
    moveSound.play();
});

function gameLoop(currentTime) {
    if (!gameStarted || gameOver) return; // Nếu game đã kết thúc, không chạy tiếp game loop

    window.requestAnimationFrame(gameLoop);

    let deltaTime = currentTime - lastTime;
    if (deltaTime < fpsInterval) return;
    lastTime = currentTime - (deltaTime % fpsInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw(ctx);
    snake.update();
    snake.draw(ctx);

    if (snake.eat(fruit)) {
        fruit.pickLocation();
        eatSound.play(); // Nếu có âm thanh khi ăn được mồi
    }

    if (snake.checkCollision()) {
        endGame(); // Gọi hàm kết thúc game khi rắn va chạm
    }

    document.querySelector('h1').innerHTML = `<span class="score">Score: ${snake.total}</span>`;
}

function endGame() {
    gameStarted = false;
    gameOver = true; // Đặt trạng thái gameOver là true khi kết thúc game
    endScreen.classList.remove("hidden"); // Hiển thị màn hình kết thúc
}
