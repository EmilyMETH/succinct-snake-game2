document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".game-board");
    const scoreDisplay = document.querySelector(".score");
    const gameOverBox = document.getElementById("gameOverBox");
    const restartBtn = document.getElementById("restartBtn");
    const congratsBox = document.getElementById("congratsBox");
    const pauseButton = document.getElementById("pause");

    let snake, food, direction, score, highScore = 0, gameInterval = null, speed, isPaused;
    
    // Set the grid size dynamically based on the gameboard width
    const gameboardWidth = board.offsetWidth; // Get the gameboard width
    const cellSize = 20; // Fixed cell size
    let gridSize = Math.floor(gameboardWidth / cellSize); // Calculate grid size based on width
    let gameboardHeight = gridSize * cellSize; // Set the height dynamically

    // Dynamically update the height of the gameboard to match the grid
    board.style.height = `${gameboardHeight}px`;

    // Initialize the snake and food positions before game starts
    snake = [{ x: 5, y: 5 }];
    food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    direction = { x: 1, y: 0 }; // Start moving right
    score = 0;
    speed = 200;
    isPaused = false;
    scoreDisplay.textContent = "Score: 0";
    gameOverBox.style.display = "none";
    congratsBox.style.display = "none";
    
    // Draw the board immediately when page loads
    drawBoard();

    // Function to start the game
    function startGame() {
        snake = [{ x: 5, y: 5 }];
        food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
        direction = { x: 1, y: 0 }; // Start moving right
        score = 0;
        speed = 200;
        isPaused = false;
        scoreDisplay.textContent = "Score: 0";
        gameOverBox.style.display = "none";
        congratsBox.style.display = "none";
        clearInterval(gameInterval);
        gameInterval = setInterval(updateSnake, speed);

        // Reset the pause button text to "Pause" when the game starts
        pauseButton.textContent = "Pause";
    }

    // Function to draw the game board
    function drawBoard() {
        board.innerHTML = "";

        // Draw the snake
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

        // Draw the food
        let foodElement = document.createElement("div");
        foodElement.style.position = "absolute";
        foodElement.style.width = `${cellSize}px`;
        foodElement.style.height = `${cellSize}px`;
        foodElement.style.left = `${food.x * cellSize}px`;
        foodElement.style.top = `${food.y * cellSize}px`;
        foodElement.style.backgroundColor = "green";
        board.appendChild(foodElement);
    }

    // Function to update the snake's position
    function updateSnake() {
        if (isPaused) return;

        let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Check for wall collisions (adjusted for dynamic grid size)
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

    // Function to handle game over
    function gameOver() {
        clearInterval(gameInterval);
        document.getElementById("finalScore").textContent = score;
        gameOverBox.style.display = "block";

        if (score > highScore) {
            highScore = score;
            congratsBox.style.display = "block";
            setTimeout(() => congratsBox.style.display = "none", 3000);
        }
    }

    // Attach event listener for restart button
    restartBtn.addEventListener("click", () => {
        gameOverBox.style.display = "none";
        startGame();
    });

    // Add event listener for the start button
    document.getElementById("start").addEventListener("click", startGame);

    // Add pause/resume functionality
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

    // Add event listener for the stop button (game over)
    document.getElementById("stop").addEventListener("click", () => { clearInterval(gameInterval); gameOver(); });

    // Handle keyboard controls for the snake's movement
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
        if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
        if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
        if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
        if (event.key === "Enter") {  // Handle Enter key for starting or restarting the game
            if (gameOverBox.style.display === "block") {
                gameOverBox.style.display = "none"; // Hide game over box
                startGame(); // Restart the game
            } else {
                startGame(); // Start the game if it's not already started
            }
        }
    });

    // Mobile Controls (up, down, left, right)
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
});
