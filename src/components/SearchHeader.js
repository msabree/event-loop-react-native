import React from 'react';
import { Header, Button, Text, Item, Icon, Input } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import usersSelector from '../selectors/users';

class SearchHeader extends React.Component {
    render() {
        return (
            <Header searchBar rounded style={{
                backgroundColor: '#fff',
            }}>
                <Item>
                    <Icon name="ios-search" />
                    <Input 
                        placeholder="Search" 
                        value={this.props.searchQuery.toLowerCase()} 
                        onChangeText={(input) => { this.props.updateSearchQuery(input) }}/>
                    <Icon name="ios-people" />
                </Item>
                <Button transparent onPress={() => { this.props.searchForUser() }}>
                    <Text>Search</Text>
                </Button>
            </Header>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        searchQuery: usersSelector(state).searchQuery,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);