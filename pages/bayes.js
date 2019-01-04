import {Component} from "react"
import { Node, Context } from 'react-mathjax2';
import {MainDisplay, theme, Form, Label, TextArea,ControlArea,Button} from '../style/PageSC'
import { Spring } from 'react-spring'

const round = x=>( Math.round(x * 100) / 100)

const getPost = (h,eh,e)=> (h*eh)/e


const draw = (prob=0.1) => Math.random() < prob;


const Fx = props=>(
    <Context input="tex">
      <Node inline>{props.tex}</Node>
    </Context>
)


const getLabel = d=>{

    let text =""
    switch(d){
        case "prior":
            text = "Current Priors";
            break
        case "joint":
            text = "Conditional Probabilities";
            break
        case "joint":
            text = "Conditional Probabilities";
            break
        case "c1":
            text = "Conditionalized Possibility 1";
            break
        case "c2":
            text = "Conditionalized Possibility 2";
            break
        case "aprior":
            text = "P(A)";
            break
        case "real":
            text ="Actual State of the World"
            break;
        case "bprior":
            text = "P(B)";
            break
        case "cprior":
            text = "P(C)";
            break;
        case "aeajoint":
            text = "P(E|A)";
            break
        case "naeajoint":
            text = "P(~E|A)";
            break
        case "bebjoint":
            text = "P(E|B)";
            break
        case "nbebjoint":
            text = "P(~E|B)";
            break
        case "cecjoint":
            text = "P(E|C)";
            break
        case "ncecjoint":
            text = "P(~E|C)";
            break
        case "aeac1":
            text = "P(A|E)";
            break
        case "bebc1":
            text = "P(B|E)";
            break
        case "cecc1":
            text = "P(C|E)";
            break
        case "ncecc2":
            text = "P(C|~E)";
            break;
        case "naeac2":
            text = "P(A|~E)";
            break
        case "nbebc2":
            text = "P(B|~E)";
            break
        case "ereal":
            text = "" ;
            break
        case "nereal":
            text = "Mild.";
            break;

            
    }
    return text
}


class Bar extends Component{
    constructor(props){
        super(props);
        const {dist,w,h,y,m,name} = props
        this.processTarget = this.processTarget.bind(this)
        const out = this.processTarget({dist,w,h,y,m,currentOrder:0,name})
        this.state = {out,currentOrder:0}
        this.handleOrder = this.handleOrder.bind(this)
    }
    processTarget(props){
        const {dist,w,h,y,m,currentOrder,name} = props;
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
                h,y,label:getLabel(p+name)
            }
        })


        return out;
    }
    componentDidUpdate(prev){
        const {dist,w,h,y,m,name} = this.props;
        const currentProps= {dist,w,h,y,m}
        if (prev.dist!==dist){
            this.setState({out:this.processTarget({dist,w,h,y,m,currentOrder:this.state.currentOrder,name})})
        } 
       
    }
    handleOrder(){
        const currentOrder = 1 -this.state.currentOrder
        const {dist,w,h,y,m,name} = this.props
        const out = this.processTarget({dist,w,h,y,m,currentOrder,name})
        this.setState({currentOrder,out})
    }
    render(){
        const {colors,y,m,name} = this.props;
        const {out} = this.state;

        return (
            <g onClick={this.handleOrder}>
                <text fill="black" x = {out[0].x} y={out[0].y-5}>{getLabel(name)}</text>
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
                        <text x ={d.x+d.w/2} y ={d.y+d.h/2} textAnchor="middle" fill={d.color==="none"?"none":"white"} fontSize={d.w>30? 18:10}>{d.label}</text>
                    ))
                }

            </g>
        )
    }
}


export default class Bayes extends Component {
    constructor(props){
        super(props);
        const ea = 0.7
        const eb = 0.5
        const ec = 0.3
        const a = 1/3
        const b = 1/3
        const c = 1/3
        const e = ea*a + eb*b + ec*c
        const real = 0.5
        this.state = {
            a,
            b,
            c,
            ea,
            eb,
            ec,
            aea:a * ea,
            beb:b * eb,
            cec:c * ec,
            e,
            real,
            n:0,
            x:0,
            move:null,
            userParm : {
                a,
                b,
                c,
                ea,
                eb,
                ec,
                e:1/2,
                real
            }

        }
        this.bayesUpdateM = this.bayesUpdateM.bind(this)
        this.bayesUpdate = this.bayesUpdate.bind(this)
        this.handlePlus = this.handlePlus.bind(this)
        this.handleMinus = this.handleMinus.bind(this)
        this.resetParm = this.resetParm.bind(this)
        
    }
    bayesUpdateM(choice){
        const evidence = choice
        const move = evidence === 1? this.conditionalized: this.conditionalized2;
        const {a,b,c,aea,beb,cec,ea,eb,ec,e} = this.state;
        let post = {}

        const pe = evidence? e : 1-e
        const pea = evidence? ea : 1-ea
        const peb = evidence? eb : 1-eb
        const pec = evidence? ec : 1-ec

        post.a = getPost(a,pea,pe)
        post.b = getPost(b,peb,pe)
        post.c = getPost(c,pec,pe)
        // if (post.a+post.b+post.c!==1){
        //     const de = post.a+post.b+post.c
        //     post.a = post.a/de
        //     post.a = post.b/de
        //     post.a = post.c/de
        // }
        post.aea = post.a*ea
        post.beb = post.b*eb
        post.cec = post.c*ec
        post.e = post.aea + post.beb + post.cec

     
        const x = this.state.x + evidence
        const n = this.state.n + 1
        this.setState({...post,n,x,move})
      
    }
    bayesUpdate(){
        const evidence = draw(this.state.real)
        const move = evidence === 1? this.conditionalized: this.conditionalized2;
        const {a,b,c,aea,beb,cec,ea,eb,ec,e} = this.state;
        let post = {}

        const pe = evidence? e : 1-e
        const pea = evidence? ea : 1-ea
        const peb = evidence? eb : 1-eb
        const pec = evidence? ec : 1-ec

        post.a = getPost(a,pea,pe)
        post.b = getPost(b,peb,pe)
        post.c = getPost(c,pec,pe)
        // if (post.a+post.b+post.c!==1){
        //     const de = post.a+post.b+post.c
        //     post.a = post.a/de
        //     post.a = post.b/de
        //     post.a = post.c/de
        // }
        post.aea = post.a*ea
        post.beb = post.b*eb
        post.cec = post.c*ec
        post.e = post.aea + post.beb + post.cec

     
        const x = this.state.x + evidence
        const n = this.state.n + 1
        this.setState({...post,n,x,move})
      
    }
    handlePlus(event){

        const {userParm} = this.state;
        if (userParm[event.target.value] <= 1 && userParm[event.target.value]>=0){
     
            let newUserParm = {
                ...this.state.userParm,
            }
            newUserParm[event.target.value] += 0.01
            this.setState({userParm:newUserParm})
        }
        
        
        
    }
    handleMinus(event){
        console.log(event.target.value)
        const {userParm} = this.state;
        if (userParm[event.target.value] <= 1 && userParm[event.target.value]>=0){

            let newUserParm = {
                ...this.state.userParm,
            }
            newUserParm[event.target.value] -= 0.01
            this.setState({userParm:newUserParm})
        }
        console.log(this.state.userParm)
        
        
    }
    resetParm(){
        const {userParm} = this.state;
        const allParms = Object.keys(userParm)
        const {a,b,c,ea,eb,ec,real} = userParm;
        let newup = {...userParm}
        
        if (a+b+c>1||a+b+c<1) {
            const de = a+b+c
            newup.a = a/de
            newup.b = b/de
            newup.c = c/de
            console.log(de)
            console.log(newup.a+newup.b+newup.c)

        }
        if (ea===eb||ea===ec||eb===ec){
            newup.ea = 0.9
            newup.eb = 0.5
            newup.ec = 0.1
        }
        console.log(newup)
        const newE = newup.a*newup.ea + newup.b*newup.eb + newup.c*newup.ec
        this.setState({
            ...newup,
            e:newE,
            aea:newup.ea*newup.a,
            beb:newup.eb*newup.b,
            cec:newup.ec*newup.c,
            userParm:newup,
            x:0,
            n:0
            
        })

    }

    render(){
        const {a,b,c,aea,beb,cec,move,real,userParm,x,n} = this.state;
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
            e: {prob:real,color:"red"},
            ne: {prob:1-real,color:"blue"},
            order:[["e","ne"],["e","ne"]]
        }
        const margin = 40
        const h = 100
        this.conditionalized = conditionalized
        this.conditionalized2 = conditionalized2
  
        return (<MainDisplay>
            {/* <Fx tex={toTex(a)}/> */}
            <ControlArea>
            <Button onClick={()=>this.bayesUpdate()} >Random Draw</Button>
            <Button onClick={()=>this.bayesUpdateM(1)} >Success</Button>
            <Button onClick={()=>this.bayesUpdateM(0)} >Failure</Button>
            <Form>
                <Label><Fx tex="P(A)"/> </Label>
                <TextArea type="text" value={round(userParm.a)}/>
                <Button onClick={this.handlePlus} value="a">+</Button>
                <Button onClick={this.handleMinus} value="a">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="P(B)"/> </Label>
                <TextArea type="text" value={round(userParm.b)}/>
                <Button onClick={this.handlePlus} value="b">+</Button>
                <Button onClick={this.handleMinus} value="b">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="P(C)"/> </Label>
                <TextArea type="text" value={round(userParm.c)}/>
                <Button onClick={this.handlePlus} value="c">+</Button>
                <Button onClick={this.handleMinus} value="c">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="P(E|A)"/> </Label>
                <TextArea type="text" value={round(userParm.ea)} />
                <Button onClick={this.handlePlus} value="ea">+</Button>
                <Button onClick={this.handleMinus} value="ea">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="P(E|B)"/> </Label>
                <TextArea type="text" value={round(userParm.eb)} />
                <Button onClick={this.handlePlus} value="eb">+</Button>
                <Button onClick={this.handleMinus} value="eb">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="P(E|C)"/> </Label>
                <TextArea type="text" value={round(userParm.ec)}/>
                <Button onClick={this.handlePlus} value="ec">+</Button>
                <Button onClick={this.handleMinus} value="ec">-</Button>
            </Form>
            <Form>
                <Label><Fx tex="\theta"/> </Label>
                <TextArea type="text" value={round(userParm.real)}/>
                <Button onClick={this.handlePlus} value="real">+</Button>
                <Button onClick={this.handleMinus} value="real">-</Button>
            </Form>
            <Button onClick={()=>this.resetParm()} >Reset Parameters</Button>
            </ControlArea>
            <ControlArea> 

                <Label>successes: {x}</Label>
            <Label>attempts: {n}</Label>
            {n!==0?
                <Spring
                    to={{v:round(x/n *100)}}
                    >
                    {props=> (<Label>sampled success:{round(props.v)}%</Label>)}
                </Spring>
                
                
                :null}
   
            </ControlArea>
           
            <svg width="800px" height="800px">
            
            <Bar dist={prior} w={700} h={h} y = {margin} m={margin} name="prior"/>

            <Bar dist={joint} w={700} h={h} y = {h+margin*2} m={margin} name="joint"/>
            <Bar dist={conditionalized} w={700} h={h} y = {h*2+margin*3} m={margin} name="c1"/>
            
            <Bar dist={conditionalized2} w={700} h={h} y = {h*3+margin*4} m={margin} name="c2"/>
                {/* { move!==null?(<ABar dist={move} w={700} h={h} y = {h*3+margin*4} m={margin} name="ac"/>):null} */}
            <Bar dist={realDist} w={700} h={h} y = {h*4+margin*5} m={margin} name="real"/>
            </svg>
           
            </MainDisplay>)
    }
}

