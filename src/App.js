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

class App extends Component {

  constructor() {
    super()
    this.state = {
      user: {email: null},
      player1: {
        playerX: 550,
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
        previous: [{playerX: 140, playerY: 250},{playerX: 145, playerY: 250},{playerX: 150, playerY: 250},{playerX: 155, playerY: 250}, {playerX: 160, playerY: 250}],
        direction: null,
        crashed: false
      },
      speed: 5,
      width: 700,
      height: 500,
      winner: null,
      socketConnect: true
    }
    
  }

  handleGameJoin = (data) => {
    console.log(data)
    console.log('jjjjoined')
  }
  //Game functions
  
  handleKeyDown = (e) => {
    let player1Copy = {...this.state.player1}
    switch(e.key) {
      case 'w':
        if(this.state.player1.direction !== 'down') {
          player1Copy.direction = 'up'
          this.setState({
            player1: player1Copy
          })
        }
        break;
      case 'a':
        if(this.state.player1.direction !== 'right') {
          player1Copy.direction = 'left'
          this.setState({
            player1: player1Copy
          })
        }
        break;
      case 's':
        if(this.state.player1.direction !== 'up') {
          player1Copy.direction = 'down'
          this.setState({
            player1: player1Copy
          })
        }
        break;
      case 'd':
        if(this.state.player1.direction !== 'left') {
          player1Copy.direction = 'right'
          this.setState({
            player1: player1Copy
          })
        }
        break;
    }

  }

  collision = () => {
    let currPos = {'playerX': this.state.player1.playerX, 'playerY': this.state.player1.playerY}
    let previous1Copy = [...this.state.player1.previous]
    let previous2Copy = [...this.state.player2.previous]
    let width = this.state.width
    let height = this.state.height
    previous1Copy[previous1Copy.length-1] = {playerX: 999999, playerY: 999999}
    previous2Copy[previous2Copy.length-1] = {playerX: 999999, playerY: 999999}
    let check = false
    previous1Copy.forEach(function(e) {
      if ((e.playerX === currPos.playerX && e.playerY === currPos.playerY)) {
        console.log('hit')
        check = true
      }
    })
    previous2Copy.forEach(function(e) {
      if ((e.playerX === currPos.playerX && e.playerY === currPos.playerY)) {
        console.log('hit')
        check = true
      }
    })
    if (currPos.playerX > width ||
        currPos.playerY > height ||
        currPos.playerX < 0 ||
        currPos.playerY < 0) {
          console.log('hit');
          check = true
    }
    return check 
  }

  draw = () => {
    let previousCopy = [...this.state.player1.previous]
    let player1Copy = {...this.state.player1}
    switch(this.state.player1.direction) {
      case 'up':
        previousCopy.push({playerX: this.state.player1.playerX, playerY: this.state.player1.playerY - this.state.speed})
        player1Copy.playerY = this.state.player1.playerY - this.state.speed
        player1Copy.previous = previousCopy
        this.setState({player1: player1Copy})
        break;
      case 'left':
        previousCopy.push({playerX: this.state.player1.playerX - this.state.speed, playerY: this.state.player1.playerY})
        player1Copy.playerX = this.state.player1.playerX - this.state.speed,
        player1Copy.previous = previousCopy
        this.setState({
          player1: player1Copy
        })
        break;
      case 'down':
        previousCopy.push({playerX: this.state.player1.playerX, playerY: this.state.player1.playerY + this.state.speed})
        player1Copy.playerY = this.state.player1.playerY + this.state.speed,
        player1Copy.previous = previousCopy
        this.setState({
          player1: player1Copy
        })
        break;
      case 'right':
        previousCopy.push({playerX: this.state.player1.playerX + this.state.speed, playerY: this.state.player1.playerY })
        player1Copy.playerX = this.state.player1.playerX + this.state.speed,
        player1Copy.previous = previousCopy
        this.setState({
          player1: player1Copy
        })
        break;
      }
    if(!this.state.winner) {
      if(this.collision()) {
        console.log('winner');
        let userCopy = this.state.user
        userCopy.losses = userCopy.losses + 1
        // this.socket.emit('gameOver')
        this.setState({
          winner: true,
          user: userCopy
        })
        this.socket.emit('game-over', {
          loser: this.socket.id
        })
      } else {
        window.requestAnimationFrame(this.draw)
      }
    }
  }

  makeTrail(player) {
    let trail = []
    player.previous.forEach(function (key) {
      trail.push(key.playerX)
      trail.push(key.playerY)
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
      this.socket.emit('move', {
        x: this.state.player1.playerX,
        y: this.state.player1.playerY
      })
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
                    <Stage tabIndex='1' ref="game" width={this.state.width} height={this.state.height}>
                      <Layer className="board" tabIndex='2'>
                        <Rect 
                          x={0} y={0} width={this.state.width} height={this.state.height}
                          fill={'gray'}
                        />
                        <Line 
                          points={this.makeTrail(this.state.player1)}
                          stroke={this.state.player1.color}
                          strokeWidth={5}
                        />
                        <Line 
                          points={this.makeTrail(this.state.player2)}
                          stroke={this.state.player2.color}
                          strokeWidth={5}
                        />
                        <Rect 
                          x={this.state.player1.playerX - 5} y={this.state.player1.playerY - 5} width={10} height={10}
                          fill={'blue'}
                        />
                        <Rect 
                          x={this.state.player2.playerX - 5} y={this.state.player2.playerY - 5} width={10} height={10}
                          fill={'orange'}
                        />
                        <CanvasComponent tabIndex='3' playerX={this.state.player1.playerX} playerY={this.state.player1.playerY} color={this.state.player1.color}/>
                        <CanvasComponent tabIndex='3' playerX={this.state.player2.playerX} playerY={this.state.player2.playerY} color={this.state.player2.color}/>
                      </Layer>
                    </Stage>
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
