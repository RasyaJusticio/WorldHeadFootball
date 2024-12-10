function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

class Collision {
  static checkCollAABB(boxA, boxB) {
    return (
      boxA.pos.x < boxB.pos.x + boxB.width &&
      boxA.pos.x + boxA.width > boxB.pos.x &&
      boxA.pos.y < boxB.pos.y + boxB.height &&
      boxA.pos.y + boxA.height > boxB.pos.y
    );
  }

  static checkCollAABBCircle(box, circle) {
    const closest = this.getClosestAABBCircle(box, circle);

    const distanceVector = circle.pos.sub(closest);
    const distance = distanceVector.mag();

    return distance <= circle.radius;
  }

  /**
   *
   * @param {*} boxA
   * @param {*} boxB
   * @param {boolean} isStatic Makes boxA static, This meant that boxA cannot be pushed by boxB.
   */
  static resolveCollAABB(boxA, boxB, isStatic) {
    const overlap = new Vector(
      Math.min(
        boxA.pos.x + boxA.width - boxB.pos.x,
        boxB.pos.x + boxB.width - boxA.pos.x
      ),
      Math.min(
        boxA.pos.y + boxA.height - boxB.pos.y,
        boxB.pos.y + boxB.height - boxA.pos.y
      )
    );

    if (overlap.x < overlap.y) {
      if (boxA.pos.x < boxB.pos.x) {
        if (isStatic) {
          boxB.pos.x += overlap.x;
        } else {
          boxA.pos.x -= overlap.x / 2;
          boxB.pos.x += overlap.x / 2;
        }
      } else if (boxA.pos.x > boxB.pos.x) {
        if (isStatic) {
          boxB.pos.x -= overlap.x;
        } else {
          boxA.pos.x += overlap.x / 2;
          boxB.pos.x -= overlap.x / 2;
        }
      }
    } else if (overlap.x > overlap.y) {
      if (boxA.pos.y < boxB.pos.y) {
        if (isStatic) {
          boxB.pos.y += overlap.y;
        } else {
          boxA.pos.y -= overlap.y / 2;
          boxB.pos.y += overlap.y / 2;
        }
      } else if (boxA.pos.y > boxB.pos.y) {
        if (isStatic) {
          boxB.pos.y -= overlap.y;
        } else {
          boxA.pos.y += overlap.y / 2;
          boxB.pos.y -= overlap.y / 2;
        }
      }
    }
  }

  static resolveCollAABBCircle(box, circle, isBoxStatic, isCircleStatic) {
    const closest = this.getClosestAABBCircle(box, circle);

    const penetration = closest.sub(circle.pos);
    const penetrationMag = penetration.mag();
    const penDepth = circle.radius - penetrationMag;
    const direction = penetration.unit();

    if (isBoxStatic) {
      circle.pos.x -= direction.x * penDepth;
      circle.pos.y -= direction.y * penDepth;
    } else if (isCircleStatic) {
      box.pos.x += direction.x * penDepth;
      box.pos.y += direction.y * penDepth;
    } else {
      circle.pos.x -= (1 / 2) * direction.x * penDepth;
      circle.pos.y -= (1 / 2) * direction.y * penDepth;
      box.pos.x += (1 / 2) * direction.x * penDepth;
      box.pos.y += (1 / 2) * direction.y * penDepth;
    }
  }

  static getCollSideAABBCircle(box, circle) {
    const closestPoint = this.getClosestAABBCircle(box, circle);

    const normal = new Vector(
      circle.pos.x - closestPoint.x,
      circle.pos.y - closestPoint.y
    );

    const absNormalX = Math.abs(normal.x);
    const absNormalY = Math.abs(normal.y);

    if (absNormalX > absNormalY) {
      return normal.x > 0 ? "right" : "left";
    } else {
      return normal.y > 0 ? "bottom" : "top";
    }
  }

  // Helper functions
  static getClosestAABBCircle(box, circle) {
    return new Vector(
      clamp(box.pos.x + box.width, box.pos.x, circle.pos.x),
      clamp(box.pos.y + box.height, box.pos.y, circle.pos.y)
    );
  }
}
