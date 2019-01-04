import {Component} from "react"
import {MainDisplay, theme} from '../style/PageSC'
import { Spring } from 'react-spring'



export class Bar extends Component{
    constructor(props){
        super(props);
        const {dist,w,h,y,m} = props
        this.processTarget = this.processTarget.bind(this)
        const out = this.processTarget({dist,w,h,y,m,currentOrder:0})
        this.state = {out,currentOrder:0}
        this.handleOrder = this.handleOrder.bind(this)
    }
    processTarget(props){
        const {dist,w,h,y,m,currentOrder} = props;
        const renderOrder = dist.order[0]
        const displayOrder = dist.order[currentOrder]
        const out = renderOrder.map((p,i)=>{
            let x= m;
            const targetIndex = displayOrder.indexOf(p)
            for (let k = 0;k<targetIndex;k++){

                x+=dist[displayOrder[k]].prob*w
            }
            return {
                x,
                w:dist[p].prob*w,
                color:dist[p].color,
                h,y,label:getLabel(p)
            }
        })


        return out;
    }
    componentDidUpdate(prev){
        const {dist,w,h,y,m} = this.props;
        const currentProps= {dist,w,h,y,m}
        if (prev.dist!==dist){
            this.setState({out:this.processTarget({dist,w,h,y,m,currentOrder:this.state.currentOrder})})
        } 
       
    }
    handleOrder(){
        const currentOrder = 1 -this.state.currentOrder
        const {dist,w,h,y,m} = this.props
        const out = this.processTarget({dist,w,h,y,m,currentOrder})
        this.setState({currentOrder,out})
        console.log(this.state)
    }
    render(){
        const {colors,y,m,name} = this.props;
        const {out} = this.state;

        return (
            <g onClick={this.handleOrder}>
                {out.map((d,i)=>(
                   
                   <Spring
                    to ={{x:d.x, width:d.w,y:d.y}}
                    key={`${name+i}_spring`}
                    >
                        {props=><rect x={props.x} y ={props.y} width={props.width} height={d.h} fill = {d.color} key={`${props.x}_${props.y}_${i}`}/>}
                   </Spring>
                ))}
                {
                    out.map((d,i)=>(
                        <text x ={d.x+d.w/2} y ={d.y+d.h/2} textAnchor="middle" fill={d.color==="none"?"none":"white"} fontSize={d.w>16? 15:5}>{d.label}</text>
                    ))
                }

            </g>
        )
    }
}

export class Bayes extends Component {
    constructor(props){
        super(props);
        this.state = {
            a:1/3,
            b:1/3,
            c:1/3,
            ea:.9,
            eb:.5,
            ec:.1,
            aea:1/3 * .9,
            beb:1/3 * .5,
            cec:1/3 * .1,
            e:1/2,
            real:.5,
            n:0,
            x:0
        }

        this.bayesUpdate = this.bayesUpdate.bind(this)
        
    }
    bayesUpdate(){
        const evidence = draw(this.state.real)
        const {a,b,c,aea,beb,cec,ea,eb,ec,e} = this.state;
        let post = {}

        const pe = evidence? e : 1-e
        const pea = evidence? ea : 1-ea
        const peb = evidence? eb : 1-eb
        const pec = evidence? ec : 1-ec

        post.a = getPost(a,pea,pe)
        post.b = getPost(b,peb,pe)
        post.c = getPost(c,pec,pe)
        post.aea = post.a*ea
        post.beb = post.b*eb
        post.cec = post.c*ec
        post.e = post.aea + post.beb + post.cec

            
        const x = this.state.x + evidence
        const n = this.state.n + 1
        this.setState({...post,n,x})
        console.log(this.state)
    }

    render(){
        const {a,b,c,aea,beb,cec,ea,eb,ec,e,real} = this.state;
        const prior = {
            a:{
                prob:a,
                color:theme.secondaryRed,
            },
            b:{
                prob:b,
                color:theme.secondaryYellow,
            },
            c:{
                prob:c,
                color:theme.secondaryBlue,
            },
            order:[["a","b","c"],["a","b","c"]]
        }

        const joint = {
            aea:{
                prob:aea,
                color:theme.secondaryRedD,
            },
            beb:{
                prob:beb,
                color:theme.secondaryYellowD,
            },
            cec:{
                prob:cec,
                color:theme.secondaryBlueD,
            },
            naea:{
                prob:a-aea,
                color:theme.secondaryRed,
            },
            nbeb:{
                prob:b-beb,
                color:theme.secondaryYellow,
            },
            ncec:{
                prob:c-cec,
                color:theme.secondaryBlue,
            },
            order:[["aea","naea","beb","nbeb","cec","ncec"],["aea","beb","cec","naea", "nbeb","ncec"]]
     
        }

        const conditionalized = {
            aea:{
                prob:aea,
                color:theme.secondaryRedD,
            },
            beb:{
                prob:beb,
                color:theme.secondaryYellowD,
            },
            cec:{
                prob:cec,
                color:theme.secondaryBlueD,
            },
            naea:{
                prob:a-aea,
                color:theme.secondaryRed,
            },
            nbeb:{
                prob:b-beb,
                color:theme.secondaryYellow,
            },
            ncec:{
                prob:c-cec,
                color:theme.secondaryBlue,
            },
            order:[["aea","beb","cec"],["aea","beb","cec"]]
     
        }

        const conditionalized2 = {
            aea:{
                prob:aea,
                color:"none",
            },
            beb:{
                prob:beb,
                color:"none",
            },
            cec:{
                prob:cec,
                color:"none",
            },
            naea:{
                prob:a-aea,
                color:theme.secondaryRed,
            },
            nbeb:{
                prob:b-beb,
                color:theme.secondaryYellow,
            },
            ncec:{
                prob:c-cec,
                color:theme.secondaryBlue,
            },
            order:[["aea","beb","cec","naea", "nbeb","ncec"],["aea","beb","cec","naea", "nbeb","ncec"]]
     
        }
        const realDist = {
            e: {prob:real,color:"black"},
            ne: {prob:1-real,color:"grey"},
            order:[["e","ne"],["e","ne"]]
        }
        const margin = 40
        const h = 100
        
       
        return (<MainDisplay>
            {/* <Fx tex={toTex(a)}/> */}

            <button onClick={()=>this.bayesUpdate()} >test</button>
            <svg width="800px" height="800px">
            <Bar dist={prior} w={700} h={h} y = {margin} m={margin} name="prior"/>

            <Bar dist={joint} w={700} h={h} y = {h+margin*2} m={margin} name="joint"/>
            <Bar dist={conditionalized} w={700} h={h} y = {h*2+margin*3} m={margin} name="joint"/>
            
            <Bar dist={conditionalized2} w={700} h={h} y = {h*3+margin*4} m={margin} name="joint"/>
            <Bar dist={realDist} w={700} h={h} y = {h*4+margin*5} m={margin} name="joint"/>
            </svg>
           
            </MainDisplay>)
    }
}
