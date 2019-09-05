import React, { Component } from 'react';
import { Container, Footer, FooterTab, Button, Icon, StyleProvider } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

import Home from '../components/Home';
import Friends from '../components/Friends';
// import Settings from '../components/Settings';

import SearchHeader from '../components/SearchHeader';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import tabsSelector from '../selectors/tabs';
import authenticationSelector from '../selectors/authentication';

class TabsContainer extends Component {

    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        // APP ENTRY POINT!!!
        await this.props.getSessionTokenFromLocalStorage();
        await this.props.getLoggedInUserInfo();

        if(this.props.sessionToken === '' || this.props.sessionToken === null){
            // remove tabs screen from stack history
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Authentication' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else{
            this.props.getEvents();
        }
    }

    componentDidUpdate() {
        if(this.props.sessionToken === '' || this.props.sessionToken === null){
            // remove tabs screen from stack history
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Authentication' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }
    
    getContent() {
        switch(this.props.activeTabIndex){
            case 0: 
                return <Home navigation={this.props.navigation} />;
            case 1: 
                return <Friends/>;
            // case 2: 
            //     return <Settings/>;                                           
            default:
                return <Home/>;
        }
    }

    getHeader() {
        switch(this.props.activeTabIndex){
            case 1:
                return <SearchHeader/>; 
            default:
                return;
        } 
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.getHeader()}
                    {this.getContent()}
                    <Footer>
                        <FooterTab>
                            <Button active={this.props.activeTabIndex === 0} onPress={() => { this.props.setActiveTab(0) }}>
                                <Icon active={this.props.activeTabIndex === 0} name="home" />
                            </Button>
                            <Button active={this.props.activeTabIndex === 1} onPress={() => { this.props.setActiveTab(1) }}>
                                <Icon active={this.props.activeTabIndex === 1} name="people" />
                            </Button>
                            {/* <Button active={this.props.activeTabIndex === 2} onPress={() => { this.props.setActiveTab(2) }}>
                                <Icon active={this.props.activeTabIndex === 2} name="settings" />
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
        sessionToken: authenticationSelector(state).sessionToken,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);