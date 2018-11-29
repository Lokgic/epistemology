import App, { Container } from 'next/app';
import Page from '../components/Page'
import { library as faLibrary} from '@fortawesome/fontawesome-svg-core'
import { faBars, faCaretDown, faChartBar,faChartArea, faTable, faComment, faShapes} from '@fortawesome/free-solid-svg-icons'

faLibrary.add(faBars,faCaretDown,faChartBar,faChartArea, faTable, faComment, faShapes)

class MyApp extends App{
    render(){
        const { Component } = this.props;
        return (
            <Container>
                <Page>
                <Component />
                </Page>

            </Container>
        )
    }
}

export default MyApp;