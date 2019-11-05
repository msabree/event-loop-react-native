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
import groupsSelector from '../selectors/groups';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import ManageGroupModal from '../components/ManageGroup/ManageGroup';

const styles = StyleSheet.create({});

class Groups extends React.Component {
  render() {
    return (
      <Container>
        <Container>
          <Content>
            <List>
              {this.props.groups.map((group, i) => (
                <ListItem key={i}>
                  <Body>
                    <Text>{startCase(group.title)}</Text>
                  </Body>
                  <Right>
                    <Button
                      onPress={() => {
                        this.props.setManageGroupModalVisible(group.id, true);
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
            this.props.setManageGroupModalVisible('', true);
          }}>
          <Icon name="add" />
        </Fab>
        <ManageGroupModal
          hideModal={() => this.setState({modalVisible: false})}
          navigation={this.props.navigation}
          editGroup={this.props.editGroup.bind(this)}
          modalVisible={this.props.modalVisible}
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
    groups: groupsSelector(state).groups,
    modalVisible: groupsSelector(state).modalVisible,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
