import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group} from 'react-konva';
import Konva from 'konva'


class CanvasComponent extends Component{
    constructor() {
        super()
        this.state = {
            color: 'green'
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({
            color: Konva.Util.getRandomColor()
        })
    }
    render(){
        return (
            <Rect
                x={10} y={10} width={50} height={50}
                fill={this.state.color}
                shadowBlur={10}
                onClick={this.handleClick}
            />
        )
    }
}

export default CanvasComponent