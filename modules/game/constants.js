const GRAVITY = 9.81;
const FRICTION = 0.992;
const ANIM_DELAY = 0.05;
const WALK_SPEED = 300;
const JUMP_POWER = 400;
const KICK_POWER = 500 * 20;
const KICK_POWER_LIFT = 15 * 20;
const BALL_TERMINAL = 2000;

const FRONT_PASS = 20 * 20;
const FRONT_PASS_LIFT = 10 * 20;
const REAR_PASS = 5 * 20;
const HEAD_PASS = 50 * 20;
const LIFT_POWER = 50 * 20;

const ITEM_SPAWN_INTERVAL = 5;
const NORMAL_BALL_RADIUS = 25;
const BIG_BALL_RADIUS = 50;
const SMALL_BALL_RADIUS = 15;

const WIDTH = 1000;
const HEIGHT = 600;

const BALL_IMG = new Image();
const COUNTRY_1_IMG = new Image();
const COUNTRY_2_IMG = new Image();

const GOAL_IMG = new Image();

const BIG_BALL_IMG = new Image();
const SMALL_BALL_IMG = new Image();
const FREEZE_BALL_IMG = new Image();

const BACKGROUND_01 = new Image();
const BACKGROUND_02 = new Image();

GOAL_IMG.src = "./assets/Goal - Side.png";

BIG_BALL_IMG.src = "./assets/Increase Ball.png";
SMALL_BALL_IMG.src = "./assets/Decrease Ball.png";
FREEZE_BALL_IMG.src = "./assets/Diamond Ice.png";

BACKGROUND_01.src = "./assets/background1.jpg";
BACKGROUND_02.src = "./assets/background1.jpg";
