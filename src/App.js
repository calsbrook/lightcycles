import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import userService from './utils/userService'
import NavBar from './NavBar/NavBar'
import SignupPage from './SignupPage/SignupPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './ProfilePage/ProfilePage'
import './App.css';

//variables

var player1 = {
  x: 550,
  y: 250,
  previous: [{x: 550, y: 250}],
  direction: null,
  speed: 5,
  color: 'orange',
  lose: false
}

var player2 = {
  x: 150,
  y: 250,
  previous: [{x: 150, y: 250}],
  direction: null,
  color: 'cyan',
  speed: 5,
  lose: false
}

// react

class App extends Component {

  constructor() {
    super()
    this.state = {
      user: {email: false},
      player1: {
        color: 'orange',
        crashed: false
      },
      player2: {
        color: 'blue',
        crashed: false
      },
      speed: 5,
      width: 700,
      height: 500,
      winner: null,
      socketConnect: false
    }
    
  }

  handleGameJoin = (data) => {
    console.log(data)
    console.log('jjjjoined')
  }

  // main animation function
  
  draw = () => {
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    var handleWin = this.handleWin
    this.drawBackground();
    this.move();
    this.drawTrail(player1);
    this.drawTrail(player2);
    this.drawBike(player1);
    this.drawBike(player2)
    if (this.state.socketConnect) {
      if (!this.collision() && !player1.lose && !player2.lose) {
        this.socket.on('winner', function (data) {
          console.log('you won')
          handleWin();
          player2.lose = true
        })
        this.socket.on('updatePlayer2', function (data){
          if(player2.x !== data.x || player2.y !== data.y) {
            player2.x = data.x
            player2.y = data.y
            player2.previous.push({x: data.x, y: data.y})
          }
        })
        this.socket.emit('move', {
          x: this.state.width - player1.x,
          y: this.state.height - player1.y
        })
        if (!player1.lose && !player2.lose) {
          window.requestAnimationFrame(this.draw)
        }
      } else {
        if(this.collision()) {
          this.socket.emit('game over', {
            loser: this.socket.id
          })
          player1.lose = true
          let userCopy = {...this.state.user}
          userCopy.losses = userCopy.losses + 1
          this.setState({
            user: userCopy
          })
          this.animateDeath(player1)
        }
      }
    }
  }
  
  //game logic
  collision = () => {
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
      console.log(player1.previous)
      console.log(currPos)
      player1.lose = true
      check = true
      }
    })
    if (currPos.x > 700 ||
      currPos.y > 500 ||
      currPos.x < 0 ||
      currPos.y < 0) {
        console.log('hit');
        console.log(currPos)
        console.log(player1.previous)
        player1.lose = true
        check = true
    }
    return check
  }

  handleWin = () => {
    if (!player2.lose) {
      console.log('YOU WIN')
      let userCopy = {...this.state.user}
      userCopy.wins = userCopy.wins + 1
      let player2Copy = {...this.state.player2}
      player2Copy.crashed = true
      this.setState({
        user: userCopy,
        player2: player2Copy
      })
    }
  }

  keyDownHandler(e) {
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

  move() {
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
        default :
          break;
      }
      let prevPos = (player1.previous[player1.previous.length-1])
      let currPos = {x: player1.x, y: player1.y}
      player1.previous.push(currPos)
    }
  }

  parseTrail(previous) {
    let trail = []
    previous.forEach(function (key) {
        trail.push(key.x)
        trail.push(key.y)
    })
    return trail
  }
  
  animateDeath = (player) => {
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    let trail = this.parseTrail(player.previous)
    ctx.beginPath();
    ctx.linewidth = 4
    ctx.strokeStyle = 'hotpink';
    ctx.moveTo(550, 250)
    for (let i = 2; i < trail.length; i += 2) {
      ctx.lineTo(trail[i], trail[i + 1])
    }
    ctx.stroke();
  }

  drawTrail = (player) => {
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    let trail = this.parseTrail(player.previous)
    ctx.beginPath();
    ctx.lineWidth = 5
    ctx.strokeStyle = player.color
    ctx.moveTo(trail[0], trail[1])
    for (let i = 2; i < trail.length; i += 2) {
        ctx.lineTo(trail[i], trail[i + 1])
    }
    ctx.stroke();
  }

  drawBike = (player) => {
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    ctx.beginPath();
    ctx.rect(player.x-5, player.y-5, 10, 10)
    ctx.fillStyle = player.color;
    ctx.fill()
    ctx.closePath();
  }

  drawBackground = () => {
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    ctx.beginPath();
    ctx.rect(0, 0, 700, 500)
    ctx.fillStyle = "black";
    ctx.fill()
    ctx.closePath()
  }


  // auth
  handleSignup = () => {
    this.setState({user: userService.getUser()});
  }

  handleLogout = () => {
    userService.logout();
    this.setState({user: null});
  }

  handleLogin = () => {
    this.setState({
      user: userService.getUser()
    });
  }

  // component reliant functions

  componentDidMount() {
    document.addEventListener('keydown', this.keyDownHandler, false)
    var canvas = document.getElementById('canvo')
    var ctx = canvas.getContext('2d')
    let user = userService.getUser();
    this.setState({user})
    this.draw();
  }

  componentDidUpdate() {
    if (!this.state.socketConnect && this.state.user) {
      this.socket = window.io.connect({ query: `user=${JSON.stringify(this.state.user)}` });
      this.socket.on('join', (data) => {
        this.handleGameJoin(data);
      });
      this.setState({
        socketConnect: true
      })
      window.requestAnimationFrame(this.draw)
    } else {
      console.log('wat')
    }
  }


  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <NavBar user={this.state.user} handleLogout={this.handleLogout}/>
            <Switch>
              <Route exact path='/signup' render={(props) => 
                <div>
                  <SignupPage 
                    {...props}
                    handleSignup={this.handleSignup}
                  />
                  <canvas hidden="true" ref="canvas" id="canvo" width={700} height={500} />
                </div>
              }/>
              <Route exact path='/login' render={(props) => 
                <div>
                  <LoginPage
                    {...props}
                    handleLogin={this.handleLogin}
                  />
                  <canvas hidden="true" ref="canvas" id="canvo" width={700} height={500} />
                </div>
              }/>
              <Route
                exact path='/profile' render={(props) =>
                  <div>
                    <ProfilePage
                      user={this.state.user}
                    />
                    <canvas hidden="true" ref="canvas" id="canvo" width={700} height={500} />
                  </div>
              }/>
              <Route exact path='/' render={(props) =>
              <div>
                  <h1>ライトサイクル</h1>
                  <p>ＬＩＧＨＴ ＣＹＣＬＥＳ</p>
                  {(!player1.lose) ? ((this.state.player2.crashed) ? (<p hidden={!this.state.user}>I knew you'd win! They haven't built a circuit that could hold you!</p>) : (<p hidden={!this.state.user}>You are {this.state.player1.color}</p>) ) : (<p hidden={!this.state.user}>░▒▓ＤＥ － ＲＥＺＥＤ▓▒░</p>)}
                  <p>Use WASD to move</p>
                  <div className="myGame">
                    <canvas hidden={!this.state.user} ref="canvas" id="canvo" width={700} height={500} />
                  </div>
                </div>
              }/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
