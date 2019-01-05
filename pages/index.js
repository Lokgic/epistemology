// import Bayes from './bayes.js'


// export default ()=>
//     (
//         <Bayes>

//         </Bayes>);

import styled from 'styled-components';
import React,{Component} from 'react'
import ATree from '../components/Tree'


const Container = styled.div`
  min-height:100vh;
  display:flex;
  > div {
    width:100%;
    max-width:95vh;
    margin:auto;
  }
  > .landscape {
    width:90vw;
    height:350px;
    max-width:none;
    max-height:20vh;
  }
  > .vertical {
    height:95vh;
    width:350px;
    max-width:20vw;
    
  }
`


const data = {
  "name": "Top Level",
  "probability":[0.1,0.9],
  "children": [
    { 
      "name": "Cancer",
      "color":"red",
      "probability":[0.8,0.2],
      fx:"P(breast cancer)",
      display:"Cancer",
      "children": [
        { "name": "+" ,"color":"pink",id:"+c",fx:"P(test positive)",display:"True Positive"},
        { "name": "-" ,"color":"orange",id:"-c",fx:"P(test negative)",display:"False Negative"}
      ]
    },
    { 
      "name": "No Cancer",
      "display": "No Cancer",
      "probability":[0.09,.91],
      "color":"blue",
      fx:"P(no breast cancer)",
      "children": [
        { "name": "+" , "color":"purple",id:"+n",fx:"P(test positive)",display:"False Positive"},
        { "name": "-" , "color":"green","id":"-n",fx:"P(test negative)",display:"True Negative"}
      ]
    }
  ]
}

export default ()=><Container><div><ATree data={data}/></div></Container>