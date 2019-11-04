import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Fab,
  Icon,
  Body,
  Right,
  Button,
} from 'native-base';
import startCase from 'lodash/startCase';

import friendsSelector from '../selectors/friends';
import groupsSelector from '../selectors/groups';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import ViewGroupModal from '../components/ViewGroup/ViewGroup';

const styles = StyleSheet.create({});

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      modalVisible: false,
      title: '',
      friends: [],
      selectedGroup: {},
      groupId: '',
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  groupDetails = group => {
    const friends = group.members.map(memberId => {
      return this.props.currentFriends.find(x => x.friendUserId === memberId);
    });
    this.setState({
      title: group.title,
      modalVisible: true,
      friends: friends,
      selectedGroup: group,
      groupId: group.id,
    });
  };

  render() {
    return (
      <Container>
        <Container>
          <Content>
            <List>
              {this.props.groups.groups.map((group, i) => (
                <ListItem key={i}>
                  <Body>
                    <Text>{startCase(group.title)}</Text>
                  </Body>
                  <Right>
                    <Button
                      onPress={() => {
                        this.groupDetails(group);
                      }}
                      transparent>
                      <Text>Manage</Text>
                    </Button>
                  </Right>
                </ListItem>
              ))}
            </List>
          </Content>
        </Container>
        <Fab
          active={false}
          containerStyle={{}}
          style={{backgroundColor: 'orange'}}
          position="bottomRight"
          onPress={() => {
            this.props.navigation.navigate('CreateGroup');
          }}>
          <Icon name="add" />
        </Fab>
        <ViewGroupModal
          componentState={this.state}
          hideModal={() => this.setState({modalVisible: false})}
          navigation={this.props.navigation}
        />
      </Container>
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
