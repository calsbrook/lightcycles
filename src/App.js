import React, { Component } from 'react';
import CanvasComponent from './CanvasComponent'
import {Layer, Rect, Stage, Group, Line} from 'react-konva';
import './App.css';


class App extends Component {

  constructor() {
    super()
    this.state = {
        playerX: 50,
        playerY: 50,
        color: 'orange',
        speed: 5,
        turbo: false,
        previous: [{playerX: 50, playerY: 50}],
        direction: null,
        width: 719,
        height: 500,
        winner: null
    }
  }
  
  handleKeyDown = (e) => {
    switch(e.key) {
      case 'w':
        if(this.state.direction !== 'down') {
          this.setState({
            direction: 'up'
          })
        }
        break;
      case 'a':
        if(this.state.direction !== 'right') {
          this.setState({
            direction: 'left'
          })
        }
        break;
      case 's':
        if(this.state.direction !== 'up') {
          this.setState({
            direction: 'down'
          })
        }
        break;
      case 'd':
        if(this.state.direction !== 'left') {
          this.setState({
            direction: 'right'
          })
        }
        break;
    }

  }

  collision = () => {
    let currPos = {'playerX': this.state.playerX, 'playerY': this.state.playerY}
    let previousCopy = [...this.state.previous]
    let width = this.state.width
    let height = this.state.height
    previousCopy[previousCopy.length-1] = {playerX: 999999, playerY: 999999}
    let check = false
    previousCopy.forEach(function(e) {
      if ((e.playerX === currPos.playerX && e.playerY === currPos.playerY) ||
        currPos.playerX > width ||
        currPos.playerY > height ||
        currPos.playerX < 0 ||
        currPos.playerY < 0) {
          console.log('hit');
          check = true
        }
  })
     return check 
  }

  draw = () => {
    let previousCopy = [...this.state.previous]
    switch(this.state.direction) {
      case 'up':
        previousCopy.push({playerX: this.state.playerX, playerY: this.state.playerY - this.state.speed})
        this.setState({
          playerY: this.state.playerY - this.state.speed,
          previous: previousCopy
        })
        break;
      case 'left':
        previousCopy.push({playerX: this.state.playerX - this.state.speed, playerY: this.state.playerY})
        this.setState({
          playerX: this.state.playerX - this.state.speed,
          previous: previousCopy
        })
        break;
      case 'down':
        previousCopy.push({playerX: this.state.playerX, playerY: this.state.playerY + this.state.speed})
        this.setState({
          playerY: this.state.playerY + this.state.speed,
          previous: previousCopy
        })
        break;
      case 'right':
        previousCopy.push({playerX: this.state.playerX + this.state.speed, playerY: this.state.playerY })
        this.setState({
          playerX: this.state.playerX + this.state.speed,
          previous: previousCopy
        })
        break;
      }
    if(!this.state.winner) {
      if(this.collision()) {
        console.log('winner');
        this.setState({
          winner: true
        })
      } else {
        window.requestAnimationFrame(this.draw)
      }
    }
  }

  makeTrail() {
    let trail = []
    this.state.previous.forEach(function (key) {
      trail.push(key.playerX)
      trail.push(key.playerY)
    })
    return trail
  }

  componentDidMount() {
    window.requestAnimationFrame(this.draw)
  }

  render() {
    return (
      <div className="page" tabIndex='0' autoFocus="true" onKeyPress={this.handleKeyDown} className="App">
        <h1>Light Bikes</h1>
        <h3>Hitting Things with Light</h3>
        {/* <canvas tabIndex='1' id="myCanvas" ref="canvas" props.={666} height={666} onKeyPress={this.handleKeyDown}> </canvas>
        <script src="../public/main.js"></scripprops.t> */}
        <div className="myGame" >
        <Stage tabIndex='1' ref="game" width={this.state.width} height={this.state.height}>
          <Layer className="board" tabIndex='2'>
            <Rect 
              x={0} y={0} width={this.state.width} height={this.state.height}
              fill={'gray'}
            />
            <Line 
              points={this.makeTrail()}
              stroke={this.state.color}
              strokeWidth={5}
            />
            <Rect 
              x={this.state.playerX - 5} y={this.state.playerY - 5} width={10} height={10}
              fill={'blue'}
            />
            <CanvasComponent autoFocus tabIndex='3' onKeyPress={this.handleKeyDown} playerX={this.state.playerX} playerY={this.state.playerY} color={this.state.color}/>
          </Layer>
        </Stage>
        </div>
      </div>
    );
  }
}

export default App;
