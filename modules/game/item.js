function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

class Item {
  /**
   *
   * @param {string} type big_ball | small_ball | freeze_ball
   */
  constructor(type) {
    this.pos = new Vector(getRandomArbitrary(150, FIELD_WIDTH - 150), 50);
    this.vel = new Vector(0, 0);

    this.width = 52;
    this.height = 52;

    this.lifetime = 7;
    this.isDead = false;

    this.type = type;
    this.image = new Image();

    this.init();
  }

  init() {
    switch (this.type) {
      case "big_ball":
        this.image = BIG_BALL_IMG;
        break;
      case "small_ball":
        this.image = SMALL_BALL_IMG;
        break;
      case "freeze_ball":
        this.image = FREEZE_BALL_IMG;
        break;
    }
  }

  update(deltaTime) {
    this.lifetime -= deltaTime;
    if (this.lifetime <= 0) {
      this.isDead = true;
    }

    if (this.pos.y <= FIELD_HEIGHT - this.height) {
      this.vel.y = GRAVITY * 8;
    } else {
      this.pos.y = FIELD_HEIGHT - this.height;
      this.vel.y = 0;
    }

    this.pos = this.pos.add(this.vel.mult(deltaTime));
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    const canvasCoord = this.pos.toCanvasCoordinate();

    context.drawImage(
      this.image,
      canvasCoord.x,
      canvasCoord.y,
      this.width,
      this.height
    );
  }
}
