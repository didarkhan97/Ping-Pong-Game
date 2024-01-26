// Define - Canvas, Contex, Paddles, Ball, and Game State
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Start Game button 
const button = document.getElementById('startButton');


// Defining paddle properties
const paddleWidth = 10;
const paddleHeight = 60;

// Setting the paddles and their positions
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 20, // Paddle speed
};

const rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 20, // Paddle speed
};

// Setting the variables to keep track of the state of keys
const keysState = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  };

// Game loop
let gameRunning = false;  // this variable tracks whether the game is running
  

// Defining the ball properties
const ballSize = 10;

// Setting the ball and its position
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: ballSize,
  dx: 6, // Ball speed in the x-axis
  dy: 6, // Ball speed in the y-axis
};

// Game state variables
let leftScore = 0;
let rightScore = 0;
const winningScore = 5;



// 2. Drawing the game state

function draw() {
  if (!gameRunning) {
    console.log('Draw was called while game not running');
    return
  }

  console.log('Drawing a frame');
  // Clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Drawing The center dotted line (TABLE NET)
  ctx.beginPath();
  ctx.setLineDash([5, 15]); // Set the line dashes
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.closePath();

  // Drawing the left paddle
  ctx.fillStyle = 'white';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  // Drawing the right paddle
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Drawing the ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // Drawing the score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left'; // Align text to the left for the left score
  ctx.fillText(`Left: ${leftScore}`, 10, 20); // Positioning it a bit away from the edge
 
  ctx.textAlign = 'right'; // Align text to the right for the right score
  ctx.fillText(`Right: ${rightScore}`, canvas.width - 10, 20); // Positioning it a bit away from the right edge
}


// Calling the draw function to initially render the game state
draw();

// 3. Handling the Paddle Movement

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
  console.log('Key down event: ', event.key);
  switch (event.key) {
    case 'ArrowUp':
      rightPaddle.y -= rightPaddle.dy;
      break;
    case 'ArrowDown':
      rightPaddle.y += rightPaddle.dy;
      break;
    case 'w':
      leftPaddle.y -= leftPaddle.dy;
      break;
    case 's':
      leftPaddle.y += leftPaddle.dy;
      break;
  }

  // Ensuring the paddles stay within the canvas bounds
  clampPaddlePositions();
}

function handleKeyUp(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      // Stopping the moving of the right paddle when key is released
      break;
    case 'w':
    case 's':
      // Stoping thhe moving of the left paddle when key is released
      break;
  }
}

function clampPaddlePositions() {
  leftPaddle.y = Math.max(0, Math.min(leftPaddle.y, canvas.height - leftPaddle.height));
  rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, canvas.height - rightPaddle.height));
}

clampPaddlePositions();

// 4. Updating the ball positions / Collision detections
function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Checking for collisions with top and bottom walls
  if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Checking for collisions with paddles
  if (
    (ball.x - ball.size / 2 < leftPaddle.x + leftPaddle.width &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height) ||
    (ball.x + ball.size / 2 > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height)
  ) {
    ball.dx = -ball.dx;
  }

  // Checking for scoring (when ball goes past paddles)
  if (ball.x - ball.size / 2 < 0) {
    rightScore++;
    checkWinner();
    resetBall();
  } else if (ball.x + ball.size / 2 > canvas.width) {
    leftScore++;
    checkWinner();
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}



function gameLoop() {
    if (gameRunning) {
      updateBallPosition();
      draw();
      requestAnimationFrame(gameLoop);
    } else {
      console.log('Game loop terminated');
    }
  }
  
// 5. Implementing the game logic

// Function to check for a winner
function checkWinner() {
  if (leftScore >= winningScore || rightScore >= winningScore) {
    let winner = leftScore >= winningScore ? "Left" : "Right";
    gameRunning = false; // Stop the game loop
    showGameOverScreen(winner);
  }
}


// Game over function
function showGameOverScreen(winner) {
  console.log('Game Over');
  // Clearing the canvas  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Setting the text style for "Game Over"    
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  // Display "Game Over" text    
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

  // Display who won the game    
  ctx.font = '20px Arial';
  ctx.fillText(winner + ' Player Wins!', canvas.width / 2, canvas.height / 2 + 20);

  // Show the "Start Over" button
  button.textContent = 'Start Over';
  button.style.display = 'block';
}


// Function to reset paddles to initial positions
function resetPaddlePositions() {
  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
}

// 6. Adding game controls
document.addEventListener('keydown', handleGameControls);
button.addEventListener('click', startGame);



function handleGameControls(event) {
  switch (event.key) {
    case 'Enter':
      startGame();
      break;
  }
}


function startGame() {
  leftScore = 0;
  rightScore = 0;
  resetPaddlePositions();    resetBall();
  if (!gameRunning) {
      gameRunning = true;
      gameLoop();
  }

  // Hide the "Start Over" button
  button.style.display = 'none';
}





// 7. Do the styling for the game


// 8. Work on PMVPs




///////// --------------------------------------------------------------------------------------------------------------/////////



/////////////---------------------------------------Original Steps and Ideas---------------------------------------////////////////


// 1. Set Up Variables
// Define - Canvas, Contex, Paddles, Ball, and Game State
// Set initial positions for sizes and position for paddles and the ball



// 2. Draw game state
// Create function to draw paddles and ball in canvas
// use 'fillRect' method to draw paddles, use 'arc' method to draw the ball


// 3. Handle Paddle Movement
// functions to handle paddle movement
// event listeners to detect button presses for paddle movement
// update paddle positions


// 4. Update ball positions
// make function to update ball position
// update ball coordinates based on current speed and direction



// 5. Collision Detection
// check for wall collisions, paddle collisions, top and bottom wall collisions.
// adjust ball directions after each collision



// 6. Implement game logic
// keep track of scores
// reset the ball position after scoring
// have winners and declare points of winning


// 7. Add game controls
// Start game control
// Restart game 


// 8. Do the styling for the game
// Have a center dotted line that resembles a net


// 9. Work on PMVPs