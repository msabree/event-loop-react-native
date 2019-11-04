import React from 'react';
import {View, StyleSheet} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Container, Text, Item, Input, Button} from 'native-base';

import friendsSelector from '../selectors/friends';
import groupsSelector from '../selectors/groups';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import pullAll from 'lodash/pullAll';

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
      title: '',
      selectedItems: [],
      create: true,
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  render() {
    const items = [...this.props.currentFriends];
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.friends
    ) {
      pullAll(items, this.props.navigation.state.params.friends);
    }
    const create =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.group
        ? false
        : true;
    return create ? (
      <React.Fragment>
        <Container>
          <Container>
            <Item>
              <Input
                onChangeText={text => {
                  this.setState({title: text});
                }}
                value={this.state.title}
                placeholder="Enter group name"
              />
            </Item>
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
          <Button
            active={false}
            containerStyle={{}}
            style={{backgroundColor: 'orange', textAlign: 'center'}}
            position="bottom"
            onPress={() => {
              this.props.createGroup(
                this.state.title,
                this.state.selectedItems,
              );
              this.props.navigation.navigate('Groups');
            }}>
            <Text>Create</Text>
          </Button>
        </Container>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Container>
          <Container>
            <View style={{flex: 1}}>
              <MultiSelect
                hideTags
                items={items.map(friend => {
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
          <Button
            active={false}
            containerStyle={{}}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{backgroundColor: 'orange', textAlign: 'center'}}
            position="bottom"
            onPress={() => {
              this.props.editGroup(
                this.state.selectedItems,
                this.props.navigation.state.params.groupId,
              );
              this.props.navigation.navigate('Groups');
            }}>
            <Text>Save</Text>
          </Button>
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
    groups: groupsSelector(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
