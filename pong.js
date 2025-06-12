const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 20;
const PADDLE_COLOR = "#42b983";

// Ball settings
const BALL_RADIUS = 11;
const BALL_COLOR = "#fff";

// Player (left) paddle
const player = {
    x: PADDLE_MARGIN,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_COLOR
};

// AI (right) paddle
const ai = {
    x: CANVAS_WIDTH - PADDLE_WIDTH - PADDLE_MARGIN,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_COLOR,
    speed: 4
};

// Ball
const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: BALL_RADIUS,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: BALL_COLOR
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff3";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

function resetBall() {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 3);
}

function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Wall collision (top/bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > CANVAS_HEIGHT) {
        ball.velocityY = -ball.velocityY;
    }

    // Left/right out of bounds (reset ball)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
        resetBall();
    }

    // Player paddle collision
    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angle = collidePoint * Math.PI / 4;
        ball.velocityX = Math.abs(ball.speed * Math.cos(angle));
        ball.velocityY = ball.speed * Math.sin(angle);
        // Ensure ball moves right
        if (ball.x < CANVAS_WIDTH / 2) ball.velocityX = Math.abs(ball.velocityX);
    }

    // AI paddle collision
    if (collision(ball, ai)) {
        let collidePoint = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
        let angle = collidePoint * Math.PI / 4;
        ball.velocityX = -Math.abs(ball.speed * Math.cos(angle));
        ball.velocityY = ball.speed * Math.sin(angle);
    }

    // AI paddle movement (simple follow)
    let target = ball.y - (ai.y + ai.height / 2);
    if (Math.abs(target) > 10) {
        ai.y += ai.speed * Math.sign(target);
    }

    // Clamp AI paddle to canvas
    ai.y = Math.max(0, Math.min(CANVAS_HEIGHT - ai.height, ai.y));
}

function collision(b, p) {
    return (
        b.x + b.radius > p.x &&
        b.x - b.radius < p.x + p.width &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + p.height
    );
}

function render() {
    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
    update();
    render();
    requestAnimationFrame(game);
}

// Mouse movement for player paddle
canvas.addEventListener("mousemove", function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle within canvas
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));
});

// Start game
game();
