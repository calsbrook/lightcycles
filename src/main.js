var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
console.log('loaded main.js')

var x = canvas.width / 2;
var y = canvas.width / 2;
var speed = 2;
var turbo = false;
var left = right = up = down = false

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        if (left === false) {
            up = down = false;
            right = true;
        }
    } else if (e.keyCode === 37) {
        if (right === false) {
            up = down = false;
            left = true;
        }
    } else if (e.keyCode === 38) {
        if (down === false) {
            right = left = false;
            up = true;
        }
    } else if (e.keyCode === 40) {
        if (up === false) {
            right = left = false;
            down = true;
        }
    } 
    if (e.keyCode === 32) {
        turbo = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 32) {
        turbo = false;
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(x, y, 10, 10)
    ctx.fillStyle = "orange"
    ctx.fill();
    ctx.closePath();
}

function draw() {
    drawPlayer();
    if (turbo) {
        speed = 4;
    } else if (!turbo) {
        speed = 2;
    }
    if (right) {
        x += speed;
    } else if (left) {
        x -= speed;
    } else if (up) {
        y -= speed;
    } else if (down) {
        y += speed;
    }
    window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw);