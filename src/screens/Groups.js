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
  Left,
  Thumbnail,
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
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Container>
            <Content>
              <List>
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={{uri: 'Image URL'}} />
                  </Left>
                  <Body>
                    <Text>Sankhadeep</Text>
                    <Text note numberOfLines={1}>
                      Its time to build a difference . .
                    </Text>
                  </Body>
                  <Right>
                    <Button transparent>
                      <Text>View</Text>
                    </Button>
                  </Right>
                </ListItem>
              </List>
            </Content>
          </Container>
          <Fab
            active={false}
            direction="left"
            containerStyle={{}}
            style={{backgroundColor: 'orange'}}
            position="bottomRight"
            onPress={() => {
              this.props.navigation.navigate('CreateGroup');
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
