// Restart & Exit Game
const restartGameBtn = document.querySelectorAll(".restart-btn");
const exitGameBtn = document.querySelectorAll(".exit-btn");

restartGameBtn.forEach((button) => {
  button.addEventListener("click", () => {
    requestRestart = true;
  });
});

exitGameBtn.forEach((button) => {
  button.addEventListener("click", () => {
    requestExit = true;
  });
});

// Pause Game
const openPauseMenuBtn = document.getElementById("openPauseMenu");
const pauseGameBtn = document.querySelectorAll(".pause-game");
const resumeGameBtn = document.querySelectorAll(".resume-game");

pauseGameBtn.forEach((button) => {
  button.addEventListener("click", (ev) => {
    isPaused = true;
  });
});

resumeGameBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (isPaused) {
      isPaused = false;
      doCountdown();
    }
  });
});

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !isCountingDown) {
    if (!isPaused) {
      openPauseMenuBtn.click();
    } else {
      resumeGameBtn[0].click();
    }
  }
});

// Countdown
const countdownLabel = document.getElementById("countdownLabel");
const openCountdownBtn = document.getElementById("openCountdown");
const closeCountdownBtn = document.getElementById("closeCountdown");

function doCountdown() {
  if (isCountingDown) {
    return;
  }

  openCountdownBtn.click();
  isCountingDown = true;
  countDown = 3;

  countdownLabel.textContent = countDown;
  countDown -= 1;

  const intervalId = setInterval(() => {
    if (countDown <= 0) {
      clearInterval(intervalId);
      isCountingDown = false;
      closeCountdownBtn.click();
    }

    countdownLabel.textContent = countDown;
    countDown -= 1;
  }, 1000);
}

// Country
const displayPlr1Country = document.querySelectorAll(".display_player1Country");
const displayPlr1CountryImg = document.querySelectorAll(
  ".display_player1CountryImg"
);
const displayPlr2Country = document.querySelectorAll(".display_player2Country");
const displayPlr2CountryImg = document.querySelectorAll(
  ".display_player2CountryImg"
);

const player1GoalLabel = document.getElementById("player1GoalLabel");
const player2GoalLabel = document.getElementById("player2GoalLabel");

function rerenderPlayerCountries() {
  displayPlr1Country.forEach((countryElem) => {
    countryElem.textContent = submittedData.player1Country;
  });
  displayPlr1CountryImg.forEach((countryImgElem) => {
    countryImgElem.src = `./assets/Flag/${submittedData.player1Country}.png`;
  });
  displayPlr2Country.forEach((countryElem) => {
    countryElem.textContent = submittedData.player2Country;
  });
  displayPlr2CountryImg.forEach((countryImgElem) => {
    countryImgElem.src = `./assets/Flag/${submittedData.player2Country}.png`;
  });
  player1GoalLabel.textContent = submittedData.player1Country;
  player2GoalLabel.textContent = submittedData.player2Country;
}

// Scores & Timer
const displayPlr1Score = document.querySelectorAll(".display_player1Score");
const displayPlr2Score = document.querySelectorAll(".display_player2Score");
const displayTimer = document.querySelectorAll(".display_timer");

function rerenderPlayerScores() {
  displayPlr1Score.forEach((scoreElem) => {
    scoreElem.textContent = score[0];
  });
  displayPlr2Score.forEach((scoreElem) => {
    scoreElem.textContent = score[1];
  });
}

function rerenderTimer() {
  displayTimer.forEach((timerElem) => {
    timerElem.textContent = timer;
  });
}

// Game Over
const openGameOverBtn = document.getElementById("openGameOver");

function openGameOver() {
  openGameOverBtn.click();
}

// Goal Text
const openPlayer1GoalBtn = document.getElementById("openPlayer1Goal");
const openPlayer2GoalBtn = document.getElementById("openPlayer2Goal");
const closePlayer1GoalBtn = document.getElementById("closePlayer1Goal");
const closePlayer2GoalBtn = document.getElementById("closePlayer2Goal");

function player1Goalie() {
  openPlayer1GoalBtn.click();
}

function player2Goalie() {
  openPlayer2GoalBtn.click();
}

function closeAllGoalieMessage() {
  closePlayer1GoalBtn.click();
  closePlayer2GoalBtn.click();
}

// Fullscreen
const goFullScreenBtn = document.getElementById("goFullScreen");

goFullScreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.getElementById("container").requestFullscreen();
  }
});
