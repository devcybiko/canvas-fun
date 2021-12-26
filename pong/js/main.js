const PADDLE_W = 10;
const PADDLE_H = 50;
const BALL_W = 10;
const BALL_H = 10;
const GOAL_PADDING = 25

const playfield = new PongPlayfield('#my_canvas');
let left = new LeftPaddle("Left", "white", GOAL_PADDING, 100, PADDLE_W, PADDLE_H);
let right = new RightPaddle("Right", "white", playfield.canvas.width-PADDLE_W-GOAL_PADDING, 100, PADDLE_W, PADDLE_H);
let ball = new Ball("Ball", "white", playfield.canvas.width/2, 20, BALL_W, BALL_H);
playfield.add(left);
playfield.add(right);
playfield.add(ball);
playfield.leftPaddle = left;
playfield.rightPaddle = right;
playfield.start(1);