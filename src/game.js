console.log('game.js connected')
var player1 = {
    x: 550,
    y: 250,
    previous: [{x: 550, y: 250}],
    direction: null,
    speed: 5,
    lose: false
  }
  
  var player2 = {
    x: 160,
    y: 250,
    previous: [{x: 160, y: 250}],
    direction: null,
    speed: 5
  }
  
const canvas = document.getElementById('canvovo')
const ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);

function draw() {
drawBackground();
move();
drawTrail();
drawBike();
if (!collision()) {
    window.requestAnimationFrame(draw)
}
}

function collision() {
    let currPos = {x: player1.x, y: player1.y}
    let width = 700
    let height = 500
    let p1PreviousCopy = [...player1.previous]
    let p2PreviousCopy = [...player2.previous]
    p1PreviousCopy[p1PreviousCopy.length-1] = {x: 999999, y: 999999}
    p2PreviousCopy[p2PreviousCopy.length-1] = {x: 999999, y: 999999}
    let check = false
    p1PreviousCopy.forEach(function(e) {
        if ((e.x === currPos.x && e.y === currPos.y)) {
        console.log('hit')
        console.log(player1.previous)
        player1.lose = true
        check = true
        }
    })
    p2PreviousCopy.forEach(function(e) {
        if ((e.x === currPos.x && e.y === currPos.y)) {
        console.log('hit')
        player1.lose = true
        check = true
        }
    })
    if (currPos.x > width ||
        currPos.y > height ||
        currPos.x < 0 ||
        currPos.y < 0) {
            console.log('hit');
            player1.lose = true
            check = true
    }
    return check 
}


function keyDownHandler(e) {
switch(e.key) {
    case 'w':
    if(player1.direction !== 'down') {
        player1.direction = 'up'
    }
    break;
    case 'a':
    if(player1.direction !== 'right') {
        player1.direction = 'left'
    }
    break;
    case 's':
    if(player1.direction !== 'up') {
        player1.direction = 'down'
    }
    break;
    case 'd':
    if(player1.direction !== 'left') {
        player1.direction = 'right'
    }
    break;
}
}

function move() {
if(player1.direction) {
    switch(player1.direction) {
    case 'up':
        player1.y = player1.y - player1.speed
        break;
    case 'left':
        player1.x = player1.x - player1.speed
        break;
    case 'down':
        player1.y = player1.y + player1.speed
        break
    case 'right':
        player1.x = player1.x + player1.speed
        break;
    }
    player1.previous.push({x: player1.x, y: player1.y})
}
}

function drawTrail() {
    let trail = parseTrail(player1.previous)
    ctx.beginPath();
    ctx.lineWidth = 5
    ctx.strokeStyle = 'orange'
    ctx.moveTo(trail[0], trail[1])
    for (let i = 2; i < trail.length; i += 2) {
        ctx.lineTo(trail[i], trail[i + 1])
    }
    ctx.stroke();
}

function parseTrail(previous) {
    let trail = []
    previous.forEach(function (key) {
        trail.push(key.x)
        trail.push(key.y)
    })
    return trail
}

function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, 700, 500)
    ctx.fillStyle = "gray";
    ctx.fill()
    ctx.closePath()
}

function drawBike() {
    ctx.beginPath();
    ctx.rect(player1.x-5, player1.y-5, 10, 10)
    ctx.fillStyle = "orange";
    ctx.fill()
    ctx.closePath();
}

draw();