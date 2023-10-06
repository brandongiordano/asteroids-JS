let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = [];
let missles = [];
let asteroids = [];

document.addEventListener('DOMContentLoaded', setupCanvas);

// Setting up the game canvas
function setupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });
    render();
}

// Ship blueprint
class Ship {
    constructor() {
        // attributes
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.03;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.03;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
    }
    // functions simulate movement
    rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }
    update() {
        let radians = this.angle;
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        if (this.x < -this.radius) {
            this.x = canvasWidth + this.radius;
        }
        if (this.x > canvasWidth + this.radius) {
            this.x = -this.radius;
        }
        if (this.y < -this.radius) {
            this.y = canvasHeight + this.radius;
        }
        if (this.y > canvasHeight + this.radius) {
            this.y = -this.radius;
        }
        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;
    }
    // draws the ship object on screen
    draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        // making triangle
        let vertAngle = ((Math.PI * 2) / 3);
        let radians = this.angle;
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians),
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
}

// let ship = new Ship();

function render() {
    ship.movingForward = keys[87];
    if (keys[68]) {
        ship.rotate(1);
    }
    if (keys[65]) {
        ship.rotate(-1);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ship.update();
    ship.draw();
    requestAnimationFrame(render);
}