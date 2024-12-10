function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param {Vector} vector
   */
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  /**
   *
   * @param {Vector} vector
   */
  sub(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  mult(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  unit() {
    const mag = this.mag();

    if (mag === 0) {
      return new Vector(getRandomArbitrary(-1, 1), 0);
    }

    return new Vector(this.x / mag, this.y / mag);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  toCanvasCoordinate() {
    return FIELD_POS.add(this);
  }
}

const FIELD_POS = new Vector(40, 0);
const FIELD_WIDTH = 915;
const FIELD_HEIGHT = 510;
