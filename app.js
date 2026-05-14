let player = document.getElementById("player");
let stars = document.querySelectorAll(".star");
let scoreDisplay = document.getElementById("score");
let highScoreDisplay = document.getElementById("highScore");
let livesDisplay = document.getElementById("lives");
let timerDisplay = document.getElementById("timer");
let restartBtn = document.getElementById("restartBtn");
let difficultySelect = document.getElementById("difficulty");

let score = 0;
let lives = 5;
let speed = 10;
let winScore = 10;
let timeLeft = 30;

let gameInterval;
let timerInterval;
let moveInterval;
let moveDirection = null;

// Initialize player position
player.style.left = "180px";
player.style.bottom = "10px";

// Initialize stars
stars.forEach(star => {
  star.style.top = "0px";
  star.style.left = Math.floor(Math.random() * 360) + "px";
});

// Load high score
let highScore = localStorage.getItem("starHighScore") || 0;
highScoreDisplay.textContent = "High Score: " + highScore;

// Difficulty settings
function setDifficulty(level) {
  if (level === "easy") speed = 3;
  if (level === "medium") speed = 5;
  if (level === "hard") speed = 8;
}

// Smooth continuous movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveDirection = "left";
  if (e.key === "ArrowRight") moveDirection = "right";

  if (!moveInterval) {
    moveInterval = setInterval(() => {
      let left = parseInt(player.style.left);
      if (moveDirection === "left" && left > 0) {
        player.style.left = left - 5 + "px"; // smooth glide
      }
      if (moveDirection === "right" && left < 340) {
        player.style.left = left + 5 + "px";
      }
    }, 20);
  }
});

document.addEventListener("keyup", () => {
  moveDirection = null;
  clearInterval(moveInterval);
  moveInterval = null;
});

// Drop stars
function dropStars() {
  stars.forEach(star => {
    let top = parseInt(star.style.top);
    if (top < 360) {
      star.style.top = top + speed + "px";
    } else {
      lives--;
      livesDisplay.textContent = "Lives: " + lives;
      resetStar(star);
      if (lives <= 0) endGame("💀 Game Over! You missed too many stars.");
    }

    let playerLeft = parseInt(player.style.left);
    let starLeft = parseInt(star.style.left);
    if (top >= 320 && Math.abs(playerLeft - starLeft) < 40) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      speed += 0.2;
      resetStar(star);
      if (score >= winScore) endGame("🎉 You win! You caught " + score + " stars!");
    }
  });
}

function resetStar(star) {
  star.style.top = "0px";
  star.style.left = Math.floor(Math.random() * 360) + "px";
}

// Countdown
function countdown() {
  timeLeft--;
  timerDisplay.textContent = "Time: " + timeLeft;
  if (timeLeft <= 0) endGame("⏰ Time’s up! Final Score: " + score);
}

// End game
function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(moveInterval);
  moveInterval = null;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("starHighScore", highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
  }
  alert(message);
}

// Restart game
restartBtn.addEventListener("click", () => {
  score = 0;
  lives = 5;
  timeLeft = 30;

  scoreDisplay.textContent = "Score: " + score;
  livesDisplay.textContent = "Lives: " + lives;
  timerDisplay.textContent = "Time: " + timeLeft;

  player.style.left = "180px";
  stars.forEach(star => resetStar(star));

  clearInterval(gameInterval);
  clearInterval(timerInterval);

  setDifficulty(difficultySelect.value);

  gameInterval = setInterval(dropStars, 50);
  timerInterval = setInterval(countdown, 1000);
});

// Start game initially
restartBtn.click();
