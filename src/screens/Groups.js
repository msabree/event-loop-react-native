import React from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {View, StyleSheet, Dimensions} from 'react-native';
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

const horizontalMargin = 20;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlideIndex: 0,
      groups: [],
      selectedItems: [],
    };
  }

  createNewGroup() {
    const groups = this.state.groups;
    groups.push({});
    this.setState({groups});
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  _renderItem({item, index}) {
    return (
      <Content key={index}>
        <Button style={styles.center} danger transparent>
          <Text>{'Delete Group'}</Text>
        </Button>
        <Item regular>
          <Input placeholder="Enter a group name" onChangeText={() => {}} />
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
            {this.multiselect ? this.multiselect.getSelectedItemsExt() : null}
          </View>
        </View>
        <List>
          <ListItem>
            <Body>
              <Text>{'Jane Doe'}</Text>
            </Body>
            <Right>
              <Button dark transparent>
                <Icon name="remove-circle-outline" />
              </Button>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{'Jane Doe'}</Text>
            </Body>
            <Right>
              <Button dark transparent>
                <Icon name="remove-circle-outline" />
              </Button>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{'Jane Doe'}</Text>
            </Body>
            <Right>
              <Button dark transparent>
                <Icon name="remove-circle-outline" />
              </Button>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{'Jane Doe'}</Text>
            </Body>
            <Right>
              <Button dark transparent>
                <Icon name="remove-circle-outline" />
              </Button>
            </Right>
          </ListItem>
        </List>
        <Button style={styles.center} success transparent>
          <Text>{'Save'}</Text>
        </Button>
      </Content>
    );
  }

  get pagination() {
    return (
      <Pagination
        dotsLength={this.state.groups.length}
        activeDotIndex={this.state.activeSlideIndex}
        containerStyle={{backgroundColor: 'transparent'}}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#8c9199',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Container>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.groups}
              onSnapToItem={index => this.setState({activeSlideIndex: index})}
              renderItem={this._renderItem.bind(this)}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
            />
            {this.pagination}
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
