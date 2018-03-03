import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import CanvasComponent from './CanvasComponent'
import {Layer, Rect, Stage, Group, Line} from 'react-konva';
import userService from './utils/userService'
import NavBar from './NavBar/NavBar'
import SignupPage from './SignupPage/SignupPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './ProfilePage/ProfilePage'
import './App.css';

var player1 = {
  x: 550,
  y: 250,
  previous: [{x: 550, y: 250}],
  direction: null,
  speed: 5
}

var player2 = {
  x: 160,
  y: 250,
  previous: [{x: 160, y: 250}],
  direction: null,
  speed: 5
}
const canvas = document.getElementById('canvo')
const ctx = canvas.getContext("2d");

function draw() {
  ctx.beginPath();
  ctx.rect(0, 0, 10, 10)
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}
draw();

class App extends Component {

  constructor() {
    super()
    this.state = {
      user: {email: null},
      player1: {
        playerX: player1.x,
        playerY: 250,
        color: 'orange',
        previous: [{playerX: 550, playerY: 250}],
        direction: null,
        crashed: false
      },
      player2: {
        playerX: 160,
        playerY: 250,
        color: 'blue',
        previous: [{playerX: 160, playerY: 250}],
        direction: null,
        crashed: false
      },
      bullshit: true,
      speed: 5,
      width: 700,
      height: 500,
      winner: null,
      socketConnect: true
    }
    
  }

  handleGameJoin = (data) => {
    // console.log(data)
    console.log('jjjjoined')
  }
  //Game functions
  
  handleKeyDown = (e) => {
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

  collision = () => {
    let currPos = {x: player1.x, y: player1.y}
    let width = this.state.width
    let height = this.state.height
    player1.previous[player1.previous.length-1] = {x: 999999, y: 999999}
    player2.previous[player2.previous.length-1] = {x: 999999, y: 999999}
    let check = false
    player1.previous.forEach(function(e) {
      if ((e.x === currPos.x && e.y === currPos.y)) {
        console.log('hit')
        check = true
      }
    })
    player2.previous.forEach(function(e) {
      if ((e.x === currPos.x && e.y === currPos.y)) {
        console.log('hit')
        check = true
      }
    })
    if (currPos.x > width ||
        currPos.y > height ||
        currPos.x < 0 ||
        currPos.y < 0) {
          console.log('hit');
          check = true
    }
    return check 
  }

  draw = () => {
    switch(player1.direction) {
      case 'up':
        player1.y = player1.y - player1.speed
        player1.previous.push({x: player1.x, y: player1.y})
        break;
      case 'left':
        player1.x = player1.x - player1.speed
        player1.previous.push({x: player1.x, y: player1.y})
        break;
      case 'down':
        player1.y = player1.y + player1.speed
        player1.previous.push({x: player1.x, y: player1.y});
      case 'right':
        player1.x = player1.x + player1.speed
        player1.previous.push({x: player1.x, y: player1.y})
        break;
      }
    if(!this.state.winner) {
      if(this.collision()) {
        console.log('winner');
        let userCopy = this.state.user
        userCopy.losses = userCopy.losses + 1
        this.setState({
          winner: true,
          user: userCopy
        })
        this.socket.emit('game-over', {
          loser: this.socket.id
        })
      } else {
        // this.socket.on('updatePlayer2', function (data){
        //   player2.x = data.x
        //   player2.y = data.y
        //   player2.previous.push({x: data.x, y: data.y})
        // })
        this.socket.emit('move', {
          x: this.state.width - player1.x,
          y: this.state.height - player1.y
        })
        // console.log(player1.previous)
        this.setState({
          bullshit: true
        })
        window.requestAnimationFrame(this.draw)
      }
    }
  }

  makeTrail(player) {
    let trail = []
    player.previous.forEach(function (key) {
      trail.push(key.x)
      trail.push(key.y)
    })
    return trail
  }

  // functions to pass
  handleSignup = () => {
    this.setState({user: userService.getUser()});
  }

  handleLogout = () => {
    userService.logout();
    this.setState({user: null});
  }

  handleLogin = () => {
    this.setState({
      user: userService.getUser(),
      playerX: 550,
      playerY: 250,
      color: 'orange',
      speed: 5,
      previous: [{playerX: 550, playerY: 250}],
      direction: null,
      width: 712,
      height: 500,
      winner: null
    });
    this.draw()
  }

  componentDidMount() {
    let user = userService.getUser();
    this.setState({user})
    
    window.requestAnimationFrame(this.draw)
  }

  componentDidUpdate() {
    if (this.state.socketConnect) {
      this.socket = window.io.connect({ query: `user=${JSON.stringify(this.state.user)}` });
      this.socket.on('join', (data) => {
        this.handleGameJoin(data);
      });
      this.setState({
        socketConnect: false
      })
    } else {
      
    }
  }


  render() {
    return (
      <div className="page" tabIndex='0' autoFocus="true" onKeyPress={this.handleKeyDown} className="App">
      <div className="sun" ></div>
        <Router>
          <div>
            <NavBar user={this.state.user} handleLogout={this.handleLogout}/>
            <Switch>
              <Route exact path='/signup' render={(props) => 
                <SignupPage 
                  {...props}
                  handleSignup={this.handleSignup}
                />
              }/>
              <Route exact path='/login' render={(props) => 
                <LoginPage
                  {...props}
                  handleLogin={this.handleLogin}
                />}
              />
              <Route
                exact path='/profile' render={(props) =>
                <ProfilePage 
                  user={this.state.user}
                />}
              />
              <Route exact path='/' render={(props) =>
                <div>
                  <h1>ライトサイクル</h1>
                  <p>ＬＩＧＨＴ ＣＹＣＬＥＳ</p>
              {(!this.state.winner) ? (<p>You are {this.state.player1.color}</p>) : (<p>░▒▓ＤＥ － ＲＥＺＥＤ▓▒░</p>)}
                  <div className="myGame" >
                    {/* <Stage tabIndex='1' ref="game" width={this.state.width} height={this.state.height}>
                      <Layer className="board" tabIndex='2'>
                        <Rect 
                          x={0} y={0} width={this.state.width} height={this.state.height}
                          fill={'gray'}
                        />
                        <Line 
                          points={this.makeTrail(player1)}
                          stroke={this.state.player1.color}
                          strokeWidth={5}
                        />
                        <Line 
                          points={this.makeTrail(player2)}
                          stroke={this.state.player2.color}
                          strokeWidth={5}
                        />
                        <Rect 
                          x={player1.x - 5} y={player1.y - 5} width={10} height={10}
                          fill={'blue'}
                        />
                        <Rect 
                          x={player2.x - 5} y={player2.y - 5} width={10} height={10}
                          fill={'orange'}
                        />
                        <CanvasComponent tabIndex='3' playerX={this.state.player1.playerX} playerY={this.state.player1.playerY} color={this.state.player1.color}/>
                        <CanvasComponent tabIndex='3' playerX={this.state.player2.playerX} playerY={this.state.player2.playerY} color={this.state.player2.color}/>
                      </Layer>
                    </Stage> */}
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
