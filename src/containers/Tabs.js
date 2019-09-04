import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

import Home from '../components/Home';
import Profile from '../components/Profile';
import Friends from '../components/Friends';
// import Settings from '../components/Settings';

import SearchHeader from '../components/SearchHeader';
import StandardHeader from '../components/StandardHeader';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import tabsSelector from '../selectors/tabs';

class TabsContainer extends Component {

    static navigationOptions = {
        header: null,
    };
    
    getContent() {
        switch(this.props.activeTabIndex){
            case 0: 
                return <Home navigation={this.props.navigation} />;
            case 1: 
                return <Profile/>;     
            case 2: 
                return <Friends/>; 
            // case 3: 
            //     return <Settings/>;                                           
            default:
                return <Home/>;
        }
    }

    getHeader() {
        switch(this.props.activeTabIndex){
            case 0:
                return <StandardHeader title='Open Invites' rightButtonIcon={'add'} onButtonPress={() => {
                    this.props.navigation.navigate('CreateEvent');
                }}/>;
            case 1: 
                return <StandardHeader title='Profile'/>;
            case 2:
                return <SearchHeader/>;
            default:
                return <StandardHeader title=''/>;
        } 
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.getHeader()}
                    <Content>
                        {this.getContent()}        
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button active={this.props.activeTabIndex === 0} onPress={() => { this.props.setActiveTab(0) }}>
                                <Icon active={this.props.activeTabIndex === 0} name="calendar" />
                            </Button>
                            <Button active={this.props.activeTabIndex === 1} onPress={() => { this.props.setActiveTab(1) }}>
                                <Icon active={this.props.activeTabIndex === 1} name="person" />
                            </Button>
                            <Button active={this.props.activeTabIndex === 2} onPress={() => { this.props.setActiveTab(2) }}>
                                <Icon active={this.props.activeTabIndex === 2} name="people" />
                            </Button>
                            {/* <Button active={this.props.activeTabIndex === 3} onPress={() => { this.props.setActiveTab(3) }}>
                                <Icon active={this.props.activeTabIndex === 3} name="settings" />
                            </Button> */}
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        activeTabIndex: tabsSelector(state).activeTabIndex,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);