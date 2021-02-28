// CONSTANTS
const HSB_MAX = 256;
const FRAME_RATE = 30;

const CANVAS_SIZE_PX = 400; // canvas size, in pixels
const CANVAS_SIZE_GRID = 20; // canvas size, in grid cell count
const CANVAS_BACKGROUND_COLOR = 0;

const GRID_CELL_SIZE = CANVAS_SIZE_PX / CANVAS_SIZE_GRID; // aka. grid cell size
const SNAKE_UPDATE_RATE = FRAME_RATE / 4; // snake is updated every `SNAKE_UPDATE_RATE` frames
const SNAKE_DIRECTION_LEFT = 0;
const SNAKE_DIRECTION_UP = 1;
const SNAKE_DIRECTION_RIGHT = 2;
const SNAKE_DIRECTION_DOWN = 3;
const SNAKE_HUE_OFFSET = HSB_MAX / 16; // offset in hue that each body part has compared to the previous one

// GLOBAL STATE (snake)
let snake_hue = 0; // snake body color
let snake_x = [4, 3, 2, 1]; // x positions of snake body parts, in grid cell count
let snake_y = [4, 4, 4, 4]; // y positions of snake body parts, in grid cell count
let snake_tick_ctr = 0; // counter to check if the snake should be updated
let snake_dir = SNAKE_DIRECTION_RIGHT;
let snake_dir_next = SNAKE_DIRECTION_RIGHT;

// GLOBAL STATE (food)
let food_x, food_y;
let food_has_been_eaten = false;

function setup() {
    // initializations
    generate_new_food();

    // settings
    colorMode(HSB, HSB_MAX);
    frameRate(FRAME_RATE);

    // canvas stuff
    createCanvas(CANVAS_SIZE_PX, CANVAS_SIZE_PX);
    background(CANVAS_BACKGROUND_COLOR);
}

function draw() {
    background(CANVAS_BACKGROUND_COLOR);

    // only update the snake every SNAKE_UPDATE_RATE frames
    if (snake_tick_ctr < SNAKE_UPDATE_RATE) {
        ++snake_tick_ctr;
    } else {
        update_snake();
        snake_tick_ctr = 0;
    }

    // TODO optimize: only need to redraw on update, really
    draw_snake();
    draw_food();
}

function update_snake() {
    // actually update snake's direction
    snake_dir = snake_dir_next;

    // move snake in the correct direction
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

    if (snake_x[0] === food_x
     && snake_y[0] === food_y) {
        food_has_been_eaten = true;
        generate_new_food();
    }
}

// advance the entire snake one tile in the direction specified by
// x and y
function move_snake(x, y) {
    // duplicate last body part if the snake has eaten food
    // (won't cause collisions cause we only check for those with the head)
    if (food_has_been_eaten) {
        snake_x.push(snake_x[snake_x.length - 1]);
        snake_y.push(snake_y[snake_y.length - 1]);
        food_has_been_eaten = false;
    }

    // move all non-head snake body parts forward, from last to first
    for (let i = snake_x.length - 1; i > 0; --i) {
        snake_x[i] = snake_x[i - 1];
        snake_y[i] = snake_y[i - 1];
    }

    // move snake head
    snake_x[0] += x;
    snake_y[0] += y;
    // wrap around the world
    if (snake_x[0] >= CANVAS_SIZE_GRID) { // reached right border
        snake_x[0] = 0;
    }
    if (snake_x[0] < 0) { // reached left border
        snake_x[0] = CANVAS_SIZE_GRID - 1;
    }
    if (snake_y[0] >= CANVAS_SIZE_GRID) { // reached lower border
        snake_y[0] = 0;
    }
    if (snake_y[0] < 0) { // reached upped border
        snake_y[0] = CANVAS_SIZE_GRID - 1;
    }
}

function generate_new_food() {
    let conflict = false;
    do {
        conflict = false;
        food_x = Math.floor(random(CANVAS_SIZE_GRID));
        food_y = Math.floor(random(CANVAS_SIZE_GRID));
        for (let i = 0; i < snake_x.length; ++i) {
            conflict = conflict | snake_x[i] === food_x | snake_y[i] === food_y;
        }
    } while (conflict);
}

function draw_snake() {
    for (let i = 0; i < snake_x.length; ++i) {
        const body_part_hue = (snake_hue + i * SNAKE_HUE_OFFSET) % HSB_MAX;
        fill(body_part_hue, HSB_MAX, HSB_MAX);
        rect(
            snake_x[i] * GRID_CELL_SIZE,
            snake_y[i] * GRID_CELL_SIZE,
            GRID_CELL_SIZE,
            GRID_CELL_SIZE
        );
    }
    snake_hue = (snake_hue + 1) % HSB_MAX;
}

function draw_food() {
    fill(color(0, 0, 255));
    rect(
        food_x * GRID_CELL_SIZE,
        food_y * GRID_CELL_SIZE,
        GRID_CELL_SIZE,
        GRID_CELL_SIZE
    );
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
