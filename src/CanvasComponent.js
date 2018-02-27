import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group} from 'react-konva';
import Konva from 'konva'


const CanvasComponent = (props) => {
    return (
            <Rect
                x={props.playerX} y={props.playerY} width={5} height={5}
                fill={props.color}
            />
    )
}


export default CanvasComponent