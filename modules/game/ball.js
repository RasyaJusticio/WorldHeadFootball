class Ball {
  constructor() {
    this.pos = new Vector(20, FIELD_HEIGHT);
    this.vel = new Vector(0, 0);
    this.radius = NORMAL_BALL_RADIUS;
    this.angleDegrees = 0;

    this.reset();
  }

  reset() {
    this.pos = new Vector(FIELD_WIDTH / 2, FIELD_HEIGHT / 3);
    this.vel = new Vector(0, 0);
  }

  update(deltaTime) {
    this.vel.x = this.vel.x * FRICTION;
    this.vel.y += GRAVITY;

    if (this.vel.x > BALL_TERMINAL) {
      this.vel.x = BALL_TERMINAL;
    }
    if (this.vel.x < -BALL_TERMINAL) {
      this.vel.x = -BALL_TERMINAL;
    }
    if (this.vel.y > BALL_TERMINAL) {
      this.vel.y = BALL_TERMINAL;
    }
    if (this.vel.y < -BALL_TERMINAL) {
      this.vel.y = -BALL_TERMINAL;
    }

    this.angleDegrees += this.vel.x / 14;

    this.pos = this.pos.add(this.vel.mult(deltaTime));

    if (this.pos.y > FIELD_HEIGHT - this.radius) {
      this.vel.y = -this.vel.y * 0.4;
      this.pos.y = FIELD_HEIGHT - this.radius;
    }

    if (this.pos.y < -FIELD_HEIGHT / 2) {
      this.vel.y = -this.vel.y;
      this.pos.y = -FIELD_HEIGHT / 2;
    }

    if (this.pos.x < this.radius) {
      this.reset();
    }

    if (this.pos.x > FIELD_WIDTH - this.radius) {
      this.reset();
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    const canvasCoord = this.pos.toCanvasCoordinate();

    // context.strokeStyle = "red";
    // context.beginPath();
    // context.arc(canvasCoord.x, canvasCoord.y, this.radius, 0, 2 * Math.PI);
    // context.stroke();
    // context.closePath();

    if (currentBallEffect === "freeze_ball") {
      context.filter = "brightness(0.5)";
    }

    context.translate(canvasCoord.x, canvasCoord.y);

    const angleRadians = this.angleDegrees * (Math.PI / 180);
    context.rotate(angleRadians);

    context.drawImage(
      BALL_IMG,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
