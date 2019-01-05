import {tree as d3Tree, hierarchy as d3Hierarchy, randomNormal, timeout} from "d3";
import {Component} from "react";
import { animated,Spring } from 'react-spring'
import styled from 'styled-components'





const rnorm = randomNormal(600,500)
const rn = ()=>parseInt(Math.max(0,rnorm()))
const Button = styled.text`
  cursor:pointer;
`



class TreeSpring extends Component{
    state = {root:this.props.nodes, currentNode:this.props.nodes, paths:this.props.paths,loc:0,go:true}
    goNext = ()=>{
        const {paths,loc,currentNode} = this.state;
        this.setState(
            paths.length>loc? {
                loc:loc+1,
             currentNode:currentNode.children[paths[loc]]
        
        }:{})
        if (currentNode.data.name === "+") this.props.addPoint(currentNode)
        if (!currentNode.children) this.setState({go:false})
    }

    render(){
        const {go,loc,currentNode,root} = this.state;
        return go?(
            <Spring
                native
                from={{x:root.x,y:root.y-50}}
                to ={{x:currentNode.x,y:currentNode.y}}
                delay={loc===0?this.props.delay:0}
                config={{ precision:0.1, friction:60, tension:280}}
                onRest={this.goNext}
                >
                {
                    props=><animated.circle
                    r={1}
                    fill={currentNode.data.color}
                    cx={props.x}
                    cy={props.y}
     
                    />
                }
            </Spring>
        ):null;

    }
}

const Branch = ({node,pathSty,updateNode}) => node.children? 
    (<g>
       {node.children.map((child,j)=>
            
            <path
                key={`node_${child.name}_${j}`}
                d={`M${node.x} ${node.y} L ${child.x} ${child.y}`}
                stroke={pathSty.stroke}
                strokeWidth={pathSty.width} 
                strokeLinecap={pathSty.linecap}
                strokeLinejoin={pathSty.linejoin}
            />)}
        {node.children.map((child,j)=>
            <Branch updateNode={updateNode} node={child} pathSty={pathSty} key={`child-node-${j}`}
            />)}
        <rect x={node.x-5} y={node.y} width={10*node.data.probability[0]} height={3} fill={node.children[0].data.color}/>
        <Button onClick={()=>updateNode(node,1)} x={node.x-5} y={node.y} fontSize="3">{"<"}</Button>
        <text x={node.x-6} y={node.y+.8} fontSize={1.5} textAnchor="end">{node.children[0].data.fx} = {node.data.probability[0]}</text>
        <rect x={node.x+10*node.data.probability[0]-5} y={node.y} width={10*node.data.probability[1]} height={3} fill = {node.children[1].data.color}/>
        <Button onClick={()=>updateNode(node,0)} x={node.x+10*node.data.probability[0]-6.5+10*node.data.probability[1]} y={node.y} fontSize="3">{">"}</Button>
        <text x={node.x+10*node.data.probability[0]+10*node.data.probability[1]-4} y={node.y+.8} fontSize={1.5} textAnchor="start">{node.children[1].data.fx} = {node.data.probability[1]}</text>
        
        {
            node.children.map((d,i)=>(
                <text 
                    key={`${d}-name-${i}`}
                    x={d.x} 
                    y={d.y-7}
                    fontSize={1.5} 
                    textAnchor="middle">
                        {d.data.display}
                </text>
            ))
        }
        
    </g>):null;



const dotGen = (nodes, n=25)=>Array.from(Array(n).keys()).map(d=>{
    const probe = (arr, nodes)=>{
        if (!nodes.children) return arr;
        else {
            const choice = Math.random() < nodes.data.probability[0]? 0:1;
            return probe([...arr, choice],nodes.children[choice])
        }
    }
    return probe([],nodes)
})


export default class TreeAnimiated extends Component{
    constructor(props){
        super(props)

        this.tree = d3Tree().size([100,70])
        const nodes = this.tree(d3Hierarchy(props.data, d=>d.children))
        this.state = {
            nodes,
            dots:dotGen(nodes,1000),
            left:[],
            right:[]
        }
        this.addPoint = this.addPoint.bind(this);
        this.updateNode = this.updateNode.bind(this);
    }
    addPoint(node){
        if (node.data.id==="+c") this.setState({left:[...this.state.left,
            {from:{x:node.x, y:node.y},color:node.data.color}
        ]})
        else this.setState({right:[...this.state.right,
            {from:{x:node.x, y:node.y},color:node.data.color}]})
        
    }
    updateNode(node,index){

        node.data.probability[index] = Math.round(Math.min(node.data.probability[index]+0.05,1 ) * 100) /100
        node.data.probability[1-index] = Math.round((1 - node.data.probability[index]) * 100) /100
        this.setState({left:[],right:[],dots:[]})
        timeout(()=>this.setState({dots:dotGen(this.state.nodes,1000)}),500)

    }
    

    render(){
        const {nodes,dots,left,right} = this.state;

        const statDimension = {
            r:1,
            yStart:80
        }
        const prob = Math.round((left.length/(left.length+right.length))*100) || 0
        return (
            <svg viewBox="-5 -5 110 110">
            <Branch 
                node={nodes}
                pathSty={{
                    stroke:"grey",
                    width:"1",
                    linecap:"round",
                    linkejoin:"round"
                }}
                updateNode={this.updateNode}
                />
            {dots.map((d,i)=><TreeSpring 
                nodes={nodes} 
                paths={d} 
                key={`key${i}`} 
                delay={i*250} 
                addPoint={this.addPoint}
                
                
                />)}
            {
                left.map((d,i)=>(
                    <Spring
                    key = {`left_${i}`}
                        native
                        from={d.from}
                        to={{x:50-(i%20)*2-1,y:statDimension.yStart+(Math.floor(i/20)*2)}}
                        >
                        {
                            props=><animated.circle
                                cx={props.x}
                                cy={props.y}
                                r={statDimension.r}
                                fill={d.color}
                                />
                        }

                    </Spring>
                ))
            }
            {
                right.map((d,i)=>(
                    <Spring
                        key = {`right_${i}`}
                        native
                        from={d.from}
                        to={{x:50+(i%20)*2+1,y:statDimension.yStart+(Math.floor(i/20)*2)}}
                        >
                        {
                            props=><animated.circle
                                cx={props.x}
                                cy={props.y}
                                r={statDimension.r}
                                fill={d.color}
                                />
                        }

                    </Spring>
                ))
            }
            <text x ={50} y = {75} fontSize={"2"} textAnchor="middle">{`P(breast cancer|test positive) = ${prob}%`}</text>
            </svg>
            );
    }
}


    