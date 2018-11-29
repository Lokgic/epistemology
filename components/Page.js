import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from 'styled-components';
import { MainContainer, GlobalStyle,theme, Header,MenuBox } from '../style/PageSC';
import Meta from './Meta';


class Page extends Component {

    render() {
        return (
            <ThemeProvider theme={theme}>

                <MainContainer>
                <Meta/>
                <GlobalStyle/>
                <Header>
                <MenuBox>
                <FontAwesomeIcon icon="bars" className = "bar" />
                </MenuBox>
                    <h1>epistemology visualized</h1>
                    </Header>
                    {this.props.children}

                </MainContainer>
            </ThemeProvider>




        );
    }
}

export default Page;