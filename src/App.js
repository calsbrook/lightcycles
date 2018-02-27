import React, { Component } from 'react';
import CanvasComponent from './CanvasComponent'
import {Layer, Rect, Stage, Group, Line} from 'react-konva';
import './App.css';


class App extends Component {

  constructor() {
    super()
    this.state = {
        playerX: 500,
        playerY: 500,
        color: 'orange',
        speed: 1,
        turbo: false,
        previous: [{playerX: 500, playerY: 500}],
        direction: 'left'
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
    window.requestAnimationFrame(this.draw)
  }

  componentDidMount() {
    window.requestAnimationFrame(this.draw)
  }

  makeTrail() {
    let trail = []
    this.state.previous.forEach(function (key) {
      trail.push(key.playerX)
      trail.push(key.playerY)
    })
    return trail
  }

  render() {
    return (
      <div tabIndex='0' autoFocus onKeyPress={this.handleKeyDown} className="App">
        <h1>Light Bikes</h1>
        <h3>Hitting Things with Light</h3>
        {/* <canvas tabIndex='1' id="myCanvas" ref="canvas" width={666} height={666} onKeyPress={this.handleKeyDown}> </canvas>
        <script src="../public/main.js"></script> */}
        <Stage  className="myGame" tabIndex='1' ref="game" width={1000} height={1000}>
          <Layer tabIndex='2'>
            <Rect 
              x={this.state.playerX} y={this.state.playerY} width={10} height={10}
              fill={'blue'}
            />
            <Line 
              points={this.makeTrail()}
              stroke={this.state.color}
              strokeWidth={5}
            />
            <CanvasComponent autoFocus tabIndex='3' onKeyPress={this.handleKeyDown} playerX={this.state.playerX} playerY={this.state.playerY} color={this.state.color}/>
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
