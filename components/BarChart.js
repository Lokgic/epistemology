import {Component} from "react";
import {scaleLinear} from "d3";
import {GridContent} from '../style/GridSC'
import {theme} from '../style/PageSC'
import styled from 'styled-components'



class Bar extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            x:0,
            y:0,
            h:20,
            w:20,
            fill:theme.secondary,
            empty:theme.primaryDark,
            ...props.properties
        }
    }
    render(){
        const {x,y,h,w,fill,empty} = this.state;
        return (
            <g>
                <rect x={`${x}%`} y={`${y+(100-h)}%`} width = {`${w}%`} height = {`${h}%`} fill= {fill}/>
                <rect x={`${x}%`} y={`${y}%`} width = {`${w}%`} height = {`${100-h}%`} fill = {empty}/>
                <text x={`${x+(w/2)}%`} y={`${y+(100-h)-2}%`} fill="white" textAnchor="middle">{h}%</text>   
            </g>
        )
    }

}



export default class BarChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            w:20,
            m:5,
        }
      
    }
    render(){
        const {w,m} = this.state;
        return (
            <GridContent>
                <svg width="100%" height="100%" >
                    
                    <Bar properties={{
                        x:50-w-m,
                        w:w,
                        h:5
                    }}/>
                    <Bar properties={{
                        x:50+m,
                        w:w,
                        h:10,

                    }}/>
                </svg>
            </GridContent>
        )
    }

}