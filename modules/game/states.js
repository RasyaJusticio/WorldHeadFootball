let isPaused = false;
let isCountingDown = false;
let isGoalScored = false;
let isGameOver = false;
let countDown = 3;

let timer = 30;
let score = [0, 0];

let requestRestart = false;
let requestExit = false;

// Ball States
let effectTimer = 0;
let currentBallEffect = "";
