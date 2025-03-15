document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".game-board");
    const scoreDisplay = document.querySelector(".score");
    const gameOverBox = document.getElementById("gameOverBox");
    const restartBtn = document.getElementById("restartBtn");
    const congratsBox = document.getElementById("congratsBox");
    const pauseButton = document.getElementById("pause");

    let snake, food, direction, score, highScore = 0, gameInterval = null, speed, isPaused;
	
	let speedUpInterval = null;
    
    const gameboardWidth = board.offsetWidth;
    const cellSize = 20;
    let gridSize = Math.floor(gameboardWidth / cellSize);
    let gameboardHeight = gridSize * cellSize;

    board.style.height = `${gameboardHeight}px`;

    snake = [{ x: 5, y: 5 }];
    food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    direction = { x: 1, y: 0 };
    score = 0;
    speed = 150;
    isPaused = false;
    scoreDisplay.textContent = "Score: 0";
    gameOverBox.style.display = "none";
    congratsBox.style.display = "none";
    
    drawBoard();

    function startGame() {
        snake = [{ x: 5, y: 5 }];
        food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
        direction = { x: 1, y: 0 };
        score = 0;
        speed = 150;
        isPaused = false;
        scoreDisplay.textContent = "Score: 0";
        gameOverBox.style.display = "none";
        congratsBox.style.display = "none";
        clearInterval(gameInterval);
        gameInterval = setInterval(updateSnake, speed);
        pauseButton.textContent = "Pause";
		
		clearInterval(speedUpInterval);
		speedUpInterval = setInterval(increaseSpeed, 4000);
    }

    function drawBoard() {
        board.innerHTML = "";

        snake.forEach(segment => {
            let snakeElement = document.createElement("div");
            snakeElement.style.position = "absolute";
            snakeElement.style.width = `${cellSize}px`;
            snakeElement.style.height = `${cellSize}px`;
            snakeElement.style.left = `${segment.x * cellSize}px`;
            snakeElement.style.top = `${segment.y * cellSize}px`;
            snakeElement.style.backgroundColor = "pink";
            board.appendChild(snakeElement);
        });

        let foodElement = document.createElement("div");
        foodElement.style.position = "absolute";
        foodElement.style.width = `${cellSize}px`;
        foodElement.style.height = `${cellSize}px`;
        foodElement.style.left = `${food.x * cellSize}px`;
        foodElement.style.top = `${food.y * cellSize}px`;
        foodElement.style.backgroundColor = "green";
        board.appendChild(foodElement);
    }

    function updateSnake() {
        if (isPaused) return;

        let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (
            head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
        } else {
            snake.pop();
        }

        drawBoard();
    }

    function gameOver() {
        clearInterval(gameInterval);
		clearInterval(speedUpInterval);
        document.getElementById("finalScore").textContent = score;
        gameOverBox.style.display = "block";

        if (score > highScore) {
            highScore = score;
            congratsBox.style.display = "block";
            setTimeout(() => congratsBox.style.display = "none", 3000);
        }
    }

    restartBtn.addEventListener("click", () => {
        gameOverBox.style.display = "none";
        startGame();
    });

    document.getElementById("start").addEventListener("click", startGame);

    pauseButton.addEventListener("click", () => {
        if (isPaused) {
            isPaused = false;
            pauseButton.textContent = "Pause";
            gameInterval = setInterval(updateSnake, speed);
        } else {
            isPaused = true;
            pauseButton.textContent = "Resume";
            clearInterval(gameInterval);
        }
    });

    document.getElementById("stop").addEventListener("click", () => { clearInterval(gameInterval); gameOver(); });

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
        if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
        if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
        if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
        if (event.key === "Enter") {  
            if (gameOverBox.style.display === "block") {
                gameOverBox.style.display = "none";
                startGame();
            } else {
                startGame();
            }
        }
    });

    document.getElementById("up").addEventListener("click", () => {
        if (direction.y === 0) direction = { x: 0, y: -1 };
    });
    document.getElementById("down").addEventListener("click", () => {
        if (direction.y === 0) direction = { x: 0, y: 1 };
    });
    document.getElementById("left").addEventListener("click", () => {
        if (direction.x === 0) direction = { x: -1, y: 0 };
    });
    document.getElementById("right").addEventListener("click", () => {
        if (direction.x === 0) direction = { x: 1, y: 0 };
    });

    function increaseSpeed() {
        if (gameInterval && speed > 50) { 
            speed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(updateSnake, speed);
        }
    }


    window.addEventListener("focus", () => { });

    window.addEventListener("blur", () => {
        clearInterval(gameInterval);
        gameInterval = null;
    });
});
