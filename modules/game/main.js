/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

// Variables
let lastItemSpawned = 5;
let lastSecond = 1;

// Objects
let items = [];
let ball = new Ball();
let goal1 = new Goal(1);
let goal2 = new Goal(2);
let player1;
let player2;

// Helper Functions
function cleanupGame() {
  isPaused = false;
  isCountingDown = false;
  isGoalScored = false;
  isGameOver = false;

  items = [];

  player1.reset();
  player2.reset();
  ball.reset();

  timer = Number(submittedData.difficulty);
  score = [0, 0];

  rerenderTimer();
  rerenderPlayerScores();
  rerenderPlayerCountries();
}

function restartGame() {
  if (!isPaused && !isGameOver) {
    return;
  }

  cleanupGame();
  doCountdown();
}

function exitGame() {
  if (!isPaused && !isGameOver) {
    return;
  }

  cleanupGame();
  navigate("lobby");
}

function doGoalie(player) {
  isGoalScored = true;
  setTimeout(() => {
    ball.reset();

    player1.reset();
    player2.reset();

    score[player - 1]++;
    rerenderPlayerScores();

    isGoalScored = false;
  }, 1000);
}

function doGameOver() {
  isGameOver = true;
  rerenderPlayerScores();
  rerenderPlayerCountries();
  openGameOver();
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function handleItemEffect(itemType) {
  if (currentBallEffect !== itemType) {
    if (itemType === "freeze_ball") {
      effectTimer = 3;
    } else {
      effectTimer = 5;
    }
    currentBallEffect = itemType;
  } else {
    if (itemType === "freeze_ball") {
      effectTimer += 3;
    } else {
      effectTimer += 5;
    }
  }

  if (itemType === "big_ball") {
    ball.radius = BIG_BALL_RADIUS;
  } else if (itemType === "small_ball") {
    ball.radius = SMALL_BALL_RADIUS;
  }
}

// Update Functions
function handleCollisions(deltaTime) {
  if (Collision.checkCollAABB(goal1, player1)) {
    Collision.resolveCollAABB(goal1, player1, true);
  }
  if (Collision.checkCollAABB(goal2, player1)) {
    Collision.resolveCollAABB(goal2, player1, true);
  }
  if (Collision.checkCollAABB(goal1, player2)) {
    Collision.resolveCollAABB(goal1, player2, true);
  }
  if (Collision.checkCollAABB(goal2, player2)) {
    Collision.resolveCollAABB(goal2, player2, true);
  }

  if (Collision.checkCollAABBCircle(player1, ball)) {
    Collision.resolveCollAABBCircle(
      player1,
      ball,
      false,
      currentBallEffect === "freeze_ball"
    );

    if (currentBallEffect !== "freeze_ball") {
      const side = Collision.getCollSideAABBCircle(player1, ball);
      player1.handleBallCollision(ball, side);
    }
  }
  if (Collision.checkCollAABBCircle(player2, ball)) {
    Collision.resolveCollAABBCircle(
      player2,
      ball,
      false,
      currentBallEffect === "freeze_ball"
    );

    if (currentBallEffect !== "freeze_ball") {
      const side = Collision.getCollSideAABBCircle(player2, ball);
      player2.handleBallCollision(ball, side);
    }
  }

  if (Collision.checkCollAABBCircle(goal1, ball)) {
    const contact = Collision.getClosestAABBCircle(goal1, ball).sub(goal1.pos);

    if (contact.x < goal1.width - 15 && contact.y > ball.radius) {
      doGoalie(2);
    } else if (
      contact.x > goal1.width - ball.radius &&
      contact.y <= ball.radius
    ) {
      if (ball.pos.x < goal1.pos.x + ball.radius) {
        ball.pos.x = goal1.pos.x + ball.radius;
      }
      ball.vel.x = Math.abs(ball.vel.x);
      ball.vel.y = -ball.vel.y;
    } else if (contact.y < 5) {
      ball.pos.y = goal1.pos.y - ball.radius;
      ball.vel.y = -ball.vel.y;
      ball.vel.x = 100;
    }
  }

  if (Collision.checkCollAABBCircle(goal2, ball)) {
    const contact = Collision.getClosestAABBCircle(goal2, ball).sub(goal2.pos);

    if (contact.x > 15 && contact.y > ball.radius) {
      doGoalie(1);
    } else if (contact.x < ball.radius && contact.y <= ball.radius) {
      if (ball.pos.x > goal2.pos.x) {
        ball.pos.x = goal2.pos.x;
      }
      ball.vel.x = -Math.abs(ball.vel.x);
      ball.vel.y = -ball.vel.y;
    } else if (contact.y < 5) {
      ball.pos.y = goal2.pos.y - ball.radius;
      ball.vel.y = -ball.vel.y;
      ball.vel.x = -100;
    }
  }

  items = items.filter((item) => {
    if (Collision.checkCollAABBCircle(item, ball) || item.isDead) {
      if (!item.isDead) {
        handleItemEffect(item.type);
      }
      return false;
    }
    return true;
  });
}

let lastItem = 0;
function handleItemSpawner(deltaTime) {
  lastItemSpawned += deltaTime;

  if (lastItemSpawned >= ITEM_SPAWN_INTERVAL) {
    lastItemSpawned = 0;

    const itemType = ["big_ball", "small_ball", "freeze_ball"][lastItem];
    lastItem += 1;
    if (lastItem > 2) {
      lastItem = 0;
    }
    items.push(new Item(itemType));
  }
}

function handleItemEffectTimer(deltaTime) {
  if (effectTimer > 0) {
    effectTimer -= deltaTime;
  }

  if (effectTimer <= 0) {
    currentBallEffect = "";
    ball.radius = NORMAL_BALL_RADIUS;
  }
}

function updateItems(deltaTime) {
  items.forEach((item) => item.update(deltaTime));
}

function updateTimer(deltaTime) {
  lastSecond += deltaTime;

  if (lastSecond >= 1) {
    lastSecond = 0;

    if (timer > 0) {
      timer--;
      rerenderTimer();
    }
  }

  if (timer <= 0 && score[0] !== score[1]) {
    doGameOver();
  }
}

// Draw Functions
function safeDraw(callback) {
  context.save();

  callback();

  context.restore();
}

function drawItems() {
  safeDraw(() => {
    items.forEach((item) => item.draw(context));
  });
}

function drawFlags() {
  safeDraw(() => {
    for (let index = 0; index < 12; index++) {
      const image = index % 2 == 0 ? COUNTRY_1_IMG : COUNTRY_2_IMG;

      context.drawImage(image, 110 * index, HEIGHT - 219, 110, 59);
    }
  });
}

function drawBackground() {
  safeDraw(() => {
    context.drawImage(BACKGROUND_02, 0, 0, WIDTH, HEIGHT);
    drawFlags();

    // context.strokeStyle = "red";
    // context.strokeRect(FIELD_POS.x, FIELD_POS.y, FIELD_WIDTH, FIELD_HEIGHT);
  });
}

// Events
document.addEventListener("keydown", (ev) => {
  if (currentPage !== "game") {
    return;
  }

  const key = ev.key.toLocaleLowerCase();

  if (key === "a") {
    player1.moveBackward(true);
  }
  if (key === "d") {
    player1.moveForward(true);
  }
  if (key === "w") {
    player1.jump(true);
  }
  if (key === " ") {
    player1.kick();
  }

  if (key === "arrowleft") {
    player2.moveForward(true);
  }
  if (key === "arrowright") {
    player2.moveBackward(true);
  }
  if (key === "arrowup") {
    player2.jump(true);
  }
  if (key === "enter") {
    player2.kick();
  }
});

document.addEventListener("keyup", (ev) => {
  if (currentPage !== "game") {
    return;
  }

  const key = ev.key.toLocaleLowerCase();

  if (key === "a") {
    player1.moveBackward(false);
  }
  if (key === "d") {
    player1.moveForward(false);
  }
  if (key === "w") {
    player1.jump(false);
  }

  if (key === "arrowleft") {
    player2.moveForward(false);
  }
  if (key === "arrowright") {
    player2.moveBackward(false);
  }
  if (key === "arrowup") {
    player2.jump(false);
  }
});

// Main
function update(deltaTime) {
  if (currentBallEffect !== "freeze_ball") {
    ball.update(deltaTime);
  }
  player1.update(deltaTime);
  player2.update(deltaTime);

  handleCollisions(deltaTime);

  handleItemSpawner(deltaTime);
  updateItems(deltaTime);
  handleItemEffectTimer(deltaTime);

  updateTimer(deltaTime);
}

function draw() {
  context.clearRect(0, 0, WIDTH, HEIGHT);

  drawBackground();

  drawItems();
  safeDraw(() => {
    ball.draw(context);
  });

  safeDraw(() => {
    if (!player1 || !player2) {
      return;
    }

    player1.draw(context);
    player2.draw(context);
  });

  safeDraw(() => {
    goal1.draw(context);
    goal2.draw(context);
  });
}

let lastTimestamp = 0;
function loop(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000 || 0;
  lastTimestamp = timestamp;

  draw();
  if (!isPaused && !isCountingDown && !isGoalScored && !isGameOver) {
    update(deltaTime);
  }

  if (requestRestart) {
    requestRestart = false;
    restartGame();
  }

  if (requestExit) {
    requestExit = false;
    exitGame();
  } else {
    requestAnimationFrame(loop);
  }
}

function init() {
  player1 = new Player(submittedData.player1Country, 1);
  player2 = new Player(submittedData.player2Country, 2);

  rerenderPlayerCountries();
  rerenderPlayerScores();
  rerenderTimer();

  doCountdown();
  loop();

  document.getElementById("container").requestFullscreen();
}

onPageChange((page) => {
  if (page === "game") {
    init();
  }
});
