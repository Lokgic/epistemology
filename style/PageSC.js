import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

export const theme = {
    sans:'Raleway',
    primary:"#ffffff",
    secondaryRed:"#e30425",
    secondaryYellow:"#e3d404",
    secondaryBlue:"#00aee3",
    secondaryRedD:"#910013",
    secondaryYellowD:"#756d00",
    secondaryBlueD:"#03277a",
    grey:"#E5E5E5",
    darkGrey:"#939393",
    offWhite:"#F4F4F4",
    black:"#202124",
    breakpoint:{
        w:["1000px","600px"],
        h:["700px"]
    }
  };


export const GlobalStyle = createGlobalStyle`
  html {
      box-sizing: border-box;
      font-size: 10px;
  }
  *, *:before, *:after {
      box-sizing: inherit;
  }
  body {

      padding: 0;
      margin: 0;
      font-size: 1.5rem;
      line-height: 2;
      font-family: ${theme.sans};
      color:${theme.black};
      background:${theme.primary};
    }
`


export const MainContainer = styled.div`
    display:grid;
    /* height:100vh; */
    grid-template-rows: auto 1fr; 
    /* min-height:400px; */
    grid-template-areas:
    "header"
    "main";
        

`


export const Header = styled.div`

    font-family:${props=>props.theme.sans};
    display:flex;
    
    grid-area:header;
    background:${props=>props.theme.primary};
    color:${props=>props.theme.black};;
    h1 {
        /* font-size: 1.2rem; */
        font-weight:700;
        font-style:italic;
        margin: auto;

    }
    


`


export const MenuBox = styled.div`

        font-size: 3rem;
        padding: 0px 10px;
        font-weight:400;
        position:absolute;
        top:10;
        left:20;


`

export const MainDisplay = styled.div`
    width:100%;
    height:auto;
    display:flex;
    flex-direction:column;
    svg{
        margin:auto;
    }
`

export const Form = styled.div`
    display:flex;
    flex-direction:column;
    margin:auto;
`

export const Label = styled.label`
    margin:auto;
`

export const TextArea = styled.input`
    width:50px;
`

export const ControlArea = styled.div`
    display:flex;
    width:100%;

`

export const Button = styled.button`
    margin:auto;
`