function getAnim(countryName, state, iterations, output) {
  for (let index = 0; index < iterations; index++) {
    const padIndex = String(index).padStart(3, "0");

    const image = new Image();
    image.src = `./assets/Characters/Character - ${countryName}/${state}/${state}_${padIndex}.png`;

    output.push(image);
  }
}

class Player {
  constructor(country, owner) {
    this.width = 80;
    this.height = 100;
    this.pos = new Vector(
      FIELD_WIDTH / 2 + this.width,
      FIELD_HEIGHT - this.height
    );
    this.vel = new Vector(0, 0);

    this.owner = owner;
    if (owner === 1) {
      this.pos.x -= this.width * 3;
    }

    this.country = country;

    this.canKick = false;
    this.isKicking = false;

    this.requestJump = false;
    this.requestMoveLeft = false;
    this.requestMoveRight = false;

    this.state = "Idle";

    this.animTimestamp = 0;
    this.animIteration = 0;

    this.sprites = {
      Idle: [],
      "Move Forward": [],
      "Move Backward": [],
      Jump: [],
      "Falling Down": [],
      Kick: [],
    };

    this.imgWidth = 80;
    this.imgHeight = 145;

    this.initSprites();
  }

  initSprites() {
    getAnim(this.country, "Idle", 18, this.sprites["Idle"]);
    getAnim(this.country, "Move Forward", 10, this.sprites["Move Forward"]);
    getAnim(this.country, "Move Backward", 10, this.sprites["Move Backward"]);
    getAnim(this.country, "Jump", 5, this.sprites["Jump"]);
    getAnim(this.country, "Falling Down", 5, this.sprites["Falling Down"]);
    getAnim(this.country, "Kick", 8, this.sprites["Kick"]);
  }

  moveForward(state) {
    if (this.owner === 1) {
      this.requestMoveRight = state;
    } else if (this.owner === 2) {
      this.requestMoveLeft = state;
    }
  }

  moveBackward(state) {
    if (this.owner === 1) {
      this.requestMoveLeft = state;
    } else if (this.owner === 2) {
      this.requestMoveRight = state;
    }
  }

  jump(state) {
    this.requestJump = state;
  }

  kick() {
    this.animIteration = 0;
    this.state = "Kick";
    this.isKicking = true;
    this.canKick = true;
  }

  // Animations
  setState(state) {
    if (state === this.state) {
      return;
    }

    this.animIteration = 0;
    this.state = state;
  }

  updateAnimation(deltaTime) {
    this.animTimestamp += deltaTime;

    if (this.animTimestamp >= ANIM_DELAY) {
      this.animIteration =
        (this.animIteration + 1) % this.sprites[this.state].length;
      this.animTimestamp = 0;
    }

    if (!this.isKicking) {
      if (this.pos.y < FIELD_HEIGHT - this.height) {
        if (this.vel.y > 0) {
          this.setState("Jump");
        } else {
          this.setState("Falling Down");
        }
      } else {
        if (this.vel.x > 0) {
          if (this.owner === 1) {
            this.setState("Move Forward");
          } else {
            this.setState("Move Backward");
          }
        } else if (this.vel.x < 0) {
          if (this.owner === 1) {
            this.setState("Move Backward");
          } else {
            this.setState("Move Forward");
          }
        } else {
          this.setState("Idle");
        }
      }
    }
  }

  getCurrentImage() {
    return this.sprites[this.state][this.animIteration];
  }

  handleBallCollision(ball, side) {
    const contact = Collision.getClosestAABBCircle(this, ball).sub(this.pos);

    // Contact at the right side
    if (contact.x >= this.width / 2 && contact.y > 5) {
      if (this.owner === 1) {
        if (this.canKick) {
          ball.vel.y -= KICK_POWER_LIFT;
          ball.vel.x = KICK_POWER;
        } else {
          ball.vel.y -= FRONT_PASS_LIFT;
          ball.vel.x = FRONT_PASS;
        }
      } else if (this.owner === 2) {
        ball.vel.x = REAR_PASS;
      }
    }

    // Contact at the left side
    else if (contact.x <= this.width / 2 && contact.y > 5) {
      if (this.owner === 1) {
        ball.vel.x = -REAR_PASS;
      } else if (this.owner === 2) {
        if (this.canKick) {
          ball.vel.y -= KICK_POWER_LIFT;
          ball.vel.x = -KICK_POWER;
        } else {
          ball.vel.y -= FRONT_PASS_LIFT;
          ball.vel.x = -FRONT_PASS;
        }
      }
    }

    // Contact at the top
    else if (contact.y <= 5) {
      if (this.owner === 1 && contact.x >= this.width / 2) {
        if (this.pos.y < FIELD_HEIGHT - this.height && this.vel.y < 10) {
          ball.vel.y = -ball.vel.y * 0.1;
          ball.vel.x = HEAD_PASS;
        } else {
          if (ball.vel.y > 0) {
            ball.vel.y = -ball.vel.y;
          }
        }
      } else if (this.owner === 2 && contact.x <= this.width / 2) {
        if (this.pos.y < FIELD_HEIGHT - this.height && this.vel.y < 10) {
          ball.vel.y = -ball.vel.y * 0.1;
          ball.vel.x = -HEAD_PASS;
        } else {
          if (ball.vel.y > 0) {
            ball.vel.y = -ball.vel.y;
          }
        }
      } else {
        if (ball.vel.y > 0) {
          ball.vel.y = -ball.vel.y;
        }
      }
    }
    // else if (contact.y >= this.height - 15) {

    //   if (this.pos.y >= FIELD_HEIGHT - this.height - ball.radius * 2) {
    //     ball.vel.y = LIFT_POWER;
    //   } else {
    //     ball.vel.y = Math.abs(ball.vel.y);
    //   }

    //   if (this.owner === 1) {
    //     ball.vel.x = FRONT_PASS / 2;
    //   } else if (this.owner === 2) {
    //     ball.vel.x = -FRONT_PASS / 2;
    //   }
    // }
  }

  // Player Controller
  handleMoving() {
    if (this.requestMoveRight) {
      this.vel.x = WALK_SPEED;
    } else if (this.requestMoveLeft) {
      this.vel.x = -WALK_SPEED;
    } else {
      this.vel.x = 0;
    }
  }

  handleJumping() {
    if (this.requestJump) {
      if (this.pos.y >= FIELD_HEIGHT - this.height) {
        this.vel.y -= JUMP_POWER;
      }
    }
  }

  handleKicking() {
    if (this.isKicking) {
      if (!this.canKick) {
        this.isKicking = false;
        return;
      }
      if (this.animIteration > 5) {
        this.canKick = false;
      }
    }
  }

  // Main
  update(deltaTime) {
    this.updateAnimation(deltaTime);

    this.handleMoving();
    this.handleJumping();
    this.handleKicking();

    if (this.pos.y > FIELD_HEIGHT - this.height) {
      this.pos.y = FIELD_HEIGHT - this.height;
      this.vel.y = 0;
    }

    if (this.pos.y < FIELD_HEIGHT - this.height) {
      this.vel.y += GRAVITY;
    }

    this.pos = this.pos.add(this.vel.mult(deltaTime));
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    const canvasCoord = this.pos.toCanvasCoordinate();

    // context.strokeStyle = "red";
    // context.lineWidth = 5;
    // context.strokeRect(canvasCoord.x, canvasCoord.y, this.width, this.height);

    const scaleSize = new Vector(this.imgWidth / 360, this.imgHeight / 360);
    const scale = Math.max(scaleSize.x, scaleSize.y);

    const offset = new Vector(
      (this.imgWidth - 360 * scale) / 2,
      (this.imgHeight - 360 * scale) / 2
    );

    // context.lineWidth = 1;
    // context.strokeStyle = "blue";
    // context.strokeRect(
    //   canvasCoord.x,
    //   canvasCoord.y - (this.imgHeight - this.height) / 2,
    //   this.imgWidth,
    //   this.imgHeight
    // );

    if (this.owner === 1) {
      context.drawImage(
        this.getCurrentImage(),
        0,
        0,
        360,
        360,
        canvasCoord.x + offset.x,
        canvasCoord.y - (this.imgHeight - this.height) / 2,
        360 * scale,
        360 * scale
      );
    } else if (this.owner === 2) {
      context.translate(canvasCoord.x + offset.x, canvasCoord.y);
      context.scale(-1, 1);

      context.drawImage(
        this.getCurrentImage(),
        0,
        0,
        360,
        360,
        0,
        -(this.imgHeight - this.height) / 2,
        -(360 * scale),
        360 * scale
      );
    }
  }
}
