import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group} from 'react-konva';
import Konva from 'konva'


const CanvasComponent = (props) => {
    return (
            <Rect
                x={props.playerX - 3} y={props.playerY - 3} width={6} height={6}
                fill={props.color}
            />
    )
}


export default CanvasComponent