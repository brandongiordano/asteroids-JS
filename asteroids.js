let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = [];
let missiles = [];
let asteroids = [];
let score = 0;
let lives = 3;

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

    for(let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
        if(e.keyCode === 32) {
           missiles.push(new Missile(ship.angle * (180 / Math.PI))); 
        }
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
        // nose cannon position
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
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
        // makes ship appear on opposite side
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
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
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

// missile blueprint
class Missile {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.width = 4;
        this.height = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }
    update() {
        var radians = this.angle * Math.PI / 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    constructor(x, y, radius, level, collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 2;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        this.level = level || 1
    }
    update() {
        var radians = this.angle * Math.PI / 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        // makes asteroid appear on opposite side
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
    }
    // draws the asteroid on screen
    draw() {
        ctx.beginPath();
        // making hexagon
        let vertAngle = ((Math.PI * 2) / 6);
        let radians = this.angle / Math.PI * 180;
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians),
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
}

function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    let radiusSum = r1 + r2;
    let xDiff = p1x - p2x;
    let yDiff = p1y - p2y;
    
    // Check if the distance between the centers of the circles is less than the sum of their radii
    if (radiusSum * radiusSum > (xDiff * xDiff) + (yDiff * yDiff)) {
        return true;
    } else {
        return false;
    }
}

// displays remaining lives
function remainingLives() {
    let startX = 1350;
    let startY = 10;
    let points = [[9,9], [-9,9]];
    ctx.strokeStyle = 'white';
    for (let i = 0; i < remainingLives; i++){
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for(let j = 0; j < points.length; j++){
            ctx.lineTo(startX + points[j][0], startY + points[j][1]);
        }
        ctx.closePath();
        ctx.stroke();
        startX -= 30;
    }
}

function render() {
    ship.movingForward = keys[87];
    if (keys[68]) {
        ship.rotate(1);
    }
    if (keys[65]) {
        ship.rotate(-1);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '21px arial';
    ctx.fillText('SCORE: ' + score.toString(), 20, 35);
    if(lives <= 0) {
        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px arial';
        ctx.fillText('GAME OVER', canvasWidth / 2 -150, canvasHeight / 2);
    }
    remainingLives();

    if(asteroids.length !== 0) {
        for(let k = 0; k <asteroids.length; k++){
            if(circleCollision(ship.x, ship.y, ship.radius, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)) {
               ship.x = canvasWidth / 2; 
               ship.y = canvasHeight / 2;
               ship.velX = 0;
               ship.velY = 0;
               lives -= 1;
            }
        }
    }

    if(asteroids.length !== 0 && missiles.length != 0) {
        loop1:
            for (let l = 0; l < asteroids.length; l++) {
                for (let m = 0; m < missiles.length; m++) {
                    if (circleCollision(missiles[m].x, missiles[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius))
                    {
                        if(asteroids[l].level === 1) {
                            asteroids.push(new Asteroid(asteroids[l].x - 5,
                                asteroids[l].y - 5, 25, 2, 22));
                            asteroids.push(new Asteroid(asteroids[l].x + 5,
                                asteroids[l].y + 5, 25, 2, 22));
                        } else if (asteroids[l].level === 2) {
                            asteroids.push(new Asteroid(asteroids[l].x - 5,
                                asteroids[l].y - 5, 15, 3, 12));
                            asteroids.push(new Asteroid(asteroids[l].x + 5,
                                asteroids[l].y + 5, 15, 3, 12));
                        }
                        asteroids.splice(l, 1);
                        missiles.splice(m, 1);
                        score += 20;
                        break loop1;
                    }
                }
            }
    }

    if(ship.visible){
        ship.update();
        ship.draw();
    }

    if(missiles.length !== 0) {
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].update();
            missiles[i].draw();
        }
    }
    if(asteroids.length !== 0) {
        for (let j = 0; j < asteroids.length; j++) {
            asteroids[j].update();
            asteroids[j].draw(j);
        }
    }
    requestAnimationFrame(render);
}