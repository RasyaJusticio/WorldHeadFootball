class Goal {
  constructor(owner) {
    this.owner = owner; // 1 | 2
    this.width = 100;
    this.height = 180;
    this.pos = new Vector(0, FIELD_HEIGHT - this.height);

    if (owner === 2) {
      this.pos.x = FIELD_WIDTH - this.width;
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    const canvasCoord = this.pos.toCanvasCoordinate();

    if (this.owner == 1) {
      context.drawImage(
        GOAL_IMG,
        canvasCoord.x,
        canvasCoord.y,
        this.width,
        this.height
      );
    } else if (this.owner == 2) {
      context.translate(canvasCoord.x, canvasCoord.y);
      context.scale(-1, 1);
      context.drawImage(GOAL_IMG, 0, 0, -this.width, this.height);
    }
  }
}
