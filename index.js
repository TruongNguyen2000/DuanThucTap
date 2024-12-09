(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // canvas size
  const canvasSize = 680;
  const w = (canvas.width = canvasSize);
  const h = (canvas.height = canvasSize);
  const canvasFillColor = "#000d36";
  const canvasStrokeColor = "rgba(211, 211, 211, 0.19)";

  const scoreEl = document.getElementById("score");
  const resetEl = document.getElementById("reset");
  const showGridEl = document.getElementById("show-grid");
  const highScoreEl = document.getElementById("high-score");
  const pauseEl = document.getElementById("pause");
  const playEl = document.getElementById("play");

  // Thêm biến để truy cập phần tử âm thanh
  const eatSound = document.getElementById("eat-sound");
  const gameoverSound = document.getElementById("gameover-sound");
  
  // Lấy phần tử âm thanh nhạc nền
  const backgroundMusic = document.getElementById("background-music");

  let score = 0;

  const setScore = () => {
    scoreEl.innerHTML = `Score 👉 ${score}`;
    if (score >= localStorage.getItem("highScore"))
      localStorage.setItem("highScore", score);
    highScoreEl.innerHTML = `HI SCORE 🚀 ${localStorage.getItem("highScore")}`;
  };

  // frame rate
  const initialFrameRate = 9.5;

  // grid padding
  const pGrid = 4;
  // grid width
  const grid_line_len = canvasSize - 2 * pGrid;
  //  cell count
  const cellCount = 44;
  // cell size
  const cellSize = grid_line_len / cellCount;

  let gameActive;

  // this will generate random color for head
  const randomColor = () => {
    let color;
    let colorArr = ["#426ff5", "#42f5e3"];
    color = colorArr[Math.floor(Math.random() * 2)];
    return color;
  };

  const head = {
    x: 2,
    y: 1,
    color: randomColor(),
    vX: 0,
    vY: 0,
    draw: () => {
      ctx.fillStyle = head.color;
      ctx.shadowColor = head.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        head.x * cellSize + pGrid,
        head.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    },
  };

  let tailLength = 4;
  let snakeParts = [];
  class Tail {
    color = "#42f57e";
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        this.x * cellSize + pGrid,
        this.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    }
  }

  const food = {
    x: 5,
    y: 5,
    color: "#FF3131",
    draw: () => {
      ctx.fillStyle = food.color;
      ctx.shadowColor = food.color;
      ctx.shadowBlur = 5;
      ctx.fillRect(
        food.x * cellSize + pGrid,
        food.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    },
  };

  class Obstacle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = "#8B0000";
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        this.x * cellSize + pGrid,
        this.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    }
  }

  let obstacles = [];

  const generateObstacle = () => {
    let obstacleX = Math.floor(Math.random() * cellCount);
    let obstacleY = Math.floor(Math.random() * cellCount);
    obstacles.push(new Obstacle(obstacleX, obstacleY));
  };

  // this will set canvas style
  const setCanvas = () => {
    // canvas fill
    ctx.fillStyle = canvasFillColor;
    ctx.fillRect(0, 0, w, h);

    // canvas stroke
    ctx.strokeStyle = canvasStrokeColor;
    ctx.strokeRect(0, 0, w, h);
  };

  //   this will draw the grid
  const drawGrid = () => {
    ctx.beginPath();
    for (let i = 0; i <= grid_line_len; i += cellSize) {
      ctx.moveTo(i + pGrid, pGrid);
      ctx.lineTo(i + pGrid, grid_line_len + pGrid);
    }
    for (let i = 0; i <= grid_line_len; i += cellSize) {
      ctx.moveTo(pGrid, i + pGrid);
      ctx.lineTo(grid_line_len + pGrid, i + pGrid);
    }
    ctx.closePath();
    ctx.strokeStyle = canvasStrokeColor;
    ctx.stroke();
  };

  const drawSnake = () => {
    //loop through our snakeparts array
    snakeParts.forEach((part) => {
      part.draw();
    });

    snakeParts.push(new Tail(head.x, head.y));

    if (snakeParts.length > tailLength) {
      snakeParts.shift(); //remove furthest item from  snake part if we have more than our tail size
    }
    head.color = randomColor();
    head.draw();
  };

  const updateSnakePosition = () => {
    head.x += head.vX;
    head.y += head.vY;
  };

  const changeDir = (e) => {
    let key = e.keyCode;

    if (key == 68 || key == 39) {
      if (head.vX === -1) return;
      head.vX = 1;
      head.vY = 0;
      gameActive = true;
      return;
    }
    if (key == 65 || key == 37) {
      if (head.vX === 1) return;
      head.vX = -1;
      head.vY = 0;
      gameActive = true;
      return;
    }
    if (key == 87 || key == 38) {
      if (head.vY === 1) return;
      head.vX = 0;
      head.vY = -1;
      gameActive = true;
      return;
    }
    if (key == 83 || key == 40) {
      if (head.vY === -1) return;
      head.vX = 0;
      head.vY = 1;
      gameActive = true;
      return;
    }
  };

  const foodCollision = () => {
    let foodCollision = false;
    snakeParts.forEach((part) => {
      if (part.x == food.x && part.y == food.y) {
        foodCollision = true;
      }
    });
    if (foodCollision) {
      food.x = Math.floor(Math.random() * cellCount);
      food.y = Math.floor(Math.random() * cellCount);
      score++;
      tailLength++;

      // Phát âm thanh khi ăn thức ăn
      eatSound.play();

      // Thêm chướng ngại vật khi điểm số đạt từ 20 trở lên
      if (score >= 20 && score % 5 === 0) {
        generateObstacle();
      }
    }
  };

  const isGameOver = () => {
    let gameOver = false;

    snakeParts.forEach((part) => {
      if (part.x == head.x && part.y == head.y) {
        gameOver = true;
      }
    });

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x > cellCount - 1 ||
      head.y > cellCount - 1 ||
      obstacleCollision() // Kiểm tra va chạm với chướng ngại vật
    ) {
      gameOver = true;
    }

    return gameOver;
  };

  const obstacleCollision = () => {
    let collision = false;
    obstacles.forEach(obstacle => {
      if (obstacle.x === head.x && obstacle.y === head.y) {
        collision = true;
      }
    });
    return collision;
  };

  const showGameOver = () => {
    // Phát âm thanh khi game over
    gameoverSound.play();

    const text = document.createElement("div");
    text.setAttribute("id", "game_over");
    text.innerHTML = "game over !";
    const body = document.querySelector("body");
    body.appendChild(text);
  };

  // Chạy nhạc nền
  const startBackgroundMusic = () => {
    backgroundMusic.play();
  };

  addEventListener("keydown", changeDir);

  const PlayButton = (show) => {
    if (!show) {
      playEl.style.display = "none";
    } else {
      playEl.style.display = "block";
    }
  };

  const pauseGame = () => {
    gameActive = false;
    if(!gameActive) {
      pauseEl.removeAttribute('class');
      pauseEl.setAttribute('class', 'pause-not-active')
    }
    if (!isGameOver()) PlayButton(true);
  };

  pauseEl.addEventListener("click", pauseGame);

  let showGrid = false;

  // this will initiate all
  const animate = () => {
    setCanvas();
    if (showGrid) drawGrid();
    drawSnake();
    food.draw();

    // Vẽ chướng ngại vật
    obstacles.forEach(obstacle => obstacle.draw());

    if (gameActive) {
      PlayButton(false);
      pauseEl.removeAttribute('class');
      pauseEl.setAttribute('class', 'pause-active');
      updateSnakePosition();

      if (isGameOver()) {
        showGameOver();
        PlayButton(false);
        backgroundMusic.pause(); // Dừng nhạc nền khi game over
        return;
      }
    }

    setScore();
    foodCollision();

    // Điều chỉnh tốc độ dựa trên điểm số
    let currentFrameRate = initialFrameRate + score * 0.2; // Tốc độ tăng 0.2 cho mỗi điểm

    setTimeout(animate, 1000 / currentFrameRate);
  };

  const resetGame = () => {
    location.reload();
  };

  resetEl.addEventListener("click", resetGame);

  const toggleGrid = () => {
    if (!showGrid) {
      showGrid = true;
      showGridEl.innerHTML = `Hide Grid`
      return;
    }
    showGrid = false;
    showGridEl.innerHTML=`Show Grid`
  };

  showGridEl.addEventListener("click", toggleGrid);

  // Bắt đầu nhạc nền khi trò chơi bắt đầu
  startBackgroundMusic();
  animate();
})();
