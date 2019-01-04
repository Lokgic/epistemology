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
export default ()=><Container><div><ATree/></div></Container>