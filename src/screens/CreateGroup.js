import React from 'react';
import {View, StyleSheet} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Fab,
  Icon,
  Item,
  Input,
  Body,
  Right,
  Button,
} from 'native-base';

import friendsSelector from '../selectors/friends';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedItems: [],
    };
  }

  createNewGroup() {}

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Container>
            <View style={{flex: 1}}>
              <MultiSelect
                hideTags
                items={this.props.currentFriends.map(friend => {
                  return {
                    name: friend._displayName || friend._username,
                    id: friend.friendUserId,
                  };
                })}
                uniqueKey="id"
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
                selectText="Pick Friends"
                searchInputPlaceholderText="Search Friends..."
                onChangeInput={text => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
              />
              <View>
                {this.multiselect
                  ? this.multiselect.getSelectedItemsExt()
                  : null}
              </View>
            </View>
          </Container>
          <Fab
            active={false}
            direction="left"
            containerStyle={{}}
            style={{backgroundColor: 'orange'}}
            position="bottomRight"
            onPress={() => {
              this.createNewGroup();
            }}>
            <Icon name="add" />
          </Fab>
        </Container>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    currentFriends: friendsSelector(state).current,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
