import React, { Component } from 'react';
import CanvasComponent from './CanvasComponent'
import {Layer, Rect, Stage, Group} from 'react-konva';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Stage width={666} height={666}>
          <Layer>
            <CanvasComponent />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
