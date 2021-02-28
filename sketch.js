// CONSTANTS
const HSB_MAX = 256;
const FRAME_RATE = 30;

const CANVAS_SIZE = 400;
const CANVAS_BACKGROUND_COLOR = 0;

const SNAKE_BODY_SIZE = CANVAS_SIZE/20; // aka. grid cell size
const SNAKE_UPDATE_RATE = FRAME_RATE/2;
const SNAKE_DIRECTION_LEFT = 0;
const SNAKE_DIRECTION_UP = 1;
const SNAKE_DIRECTION_RIGHT = 2;
const SNAKE_DIRECTION_DOWN = 3;

// GLOBAL STATE
let snake_hue = 0; // snake body color
let snake_x = [4*SNAKE_BODY_SIZE, 3*SNAKE_BODY_SIZE, 2*SNAKE_BODY_SIZE]; // x positions of snake body parts
let snake_y = [4*SNAKE_BODY_SIZE, 4*SNAKE_BODY_SIZE, 4*SNAKE_BODY_SIZE]; // y positions of snake body parts
let snake_tick_ctr = 0; // counter to check if the snake should be updated
let snake_dir = SNAKE_DIRECTION_RIGHT;
let snake_dir_next = SNAKE_DIRECTION_RIGHT;

function setup() {
    // settings
    colorMode(HSB, HSB_MAX);
    frameRate(FRAME_RATE);

    // canvas stuff
    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    background(CANVAS_BACKGROUND_COLOR);
}

function draw() {
    background(CANVAS_BACKGROUND_COLOR);
    update_snake();
    draw_snake();
}

function update_snake() {
    // do not update the snake before necessary
    if (snake_tick_ctr < SNAKE_UPDATE_RATE) {
        ++snake_tick_ctr;
        return;
    }

    // actually update the snakes direction
    snake_dir = snake_dir_next;

    // move snake in the right direction
    switch (snake_dir) {
        case SNAKE_DIRECTION_LEFT:
            move_snake(-1, 0);
            break;
        case SNAKE_DIRECTION_UP:
            move_snake(0, -1);
            break;
        case SNAKE_DIRECTION_RIGHT:
            move_snake(1, 0);
            break;
        case SNAKE_DIRECTION_DOWN:
            move_snake(0, 1);
            break;
    }

    // advance the entire snake one tile in the direction specified by
    // x and y
    function move_snake(x, y) {
        // move all non-head snake body parts forward, from last to first
        for (let i = snake_x.length - 1; i > 0; --i) {
            snake_x[i] = snake_x[i - 1];
            snake_y[i] = snake_y[i - 1];
        }

        // move snake head
        snake_x[0] += x * SNAKE_BODY_SIZE;
        snake_y[0] += y * SNAKE_BODY_SIZE;
    }

    snake_tick_ctr = 0;
}

function draw_snake() {
    fill(snake_hue, HSB_MAX, HSB_MAX);
    for (let i = 0; i < snake_x.length; ++i) {
        rect(snake_x[i], snake_y[i], SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
    }
    snake_hue = (snake_hue + 1) % HSB_MAX;
}

function keyPressed() {
    // change the direction according to input
    // `snake_dir_next` exists to avoid weird behaviour
    // when smashing direction keys between snake updates
    switch(keyCode) {
    case LEFT_ARROW:
        if (snake_dir !== SNAKE_DIRECTION_RIGHT) {
            snake_dir_next = SNAKE_DIRECTION_LEFT;
        }
        break;
    case UP_ARROW:
        if (snake_dir !== SNAKE_DIRECTION_DOWN) {

            snake_dir_next = SNAKE_DIRECTION_UP;
        }
        break;
    case RIGHT_ARROW:
        if (snake_dir !== SNAKE_DIRECTION_LEFT) {
            snake_dir_next = SNAKE_DIRECTION_RIGHT;
        }
        break;
    case DOWN_ARROW:
        if (snake_dir !== SNAKE_DIRECTION_UP) {
            snake_dir_next = SNAKE_DIRECTION_DOWN;
        }
        break;
    }
}
