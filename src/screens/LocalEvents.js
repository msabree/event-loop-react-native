/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Linking, Image, FlatList, Dimensions} from 'react-native';
import {
  Text,
  Card,
  CardItem,
  Button,
  Icon,
  Body,
  Container,
  H3,
} from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import get from 'lodash/get';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import userSelector from '../selectors/users';
import authenticationSelector from '../selectors/authentication';
import dealsSelector from '../selectors/deals';

// TEST DATA... DO NOT COMMIT TEST DATA FILE
import {TEST_DATA} from '../constants/testData';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  headerProfilePic: {
    width: 60,
    height: 60,
  },
});

class LocalEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = TEST_DATA;
  }

  render() {
    const imageWidth = Math.round(Dimensions.get('window').width * 0.9);
    const imageHeight = Math.round(imageWidth / 2);
    return (
      <React.Fragment>
        <Container style={{marginTop: 30}}>
          <FlatList
            data={this.state.deals}
            onRefresh={() => {
              console.log('refresh now');
            }}
            refreshing={false}
            renderItem={({item}) => {
              const {dealUrl} = item;
              return (
                <Card style={styles.center} key={item.uuid}>
                  <CardItem>
                    <Body>
                      <Image
                        source={{
                          uri: item.largeImageUrl,
                        }}
                        style={{
                          height: imageHeight,
                          width: imageWidth,
                          borderRadius: 5,
                          flex: 1,
                          resizeMode: 'contain',
                        }}
                      />
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <H3 style={{color: '#58534d', marginBottom: 5}}>
                        {item.title}
                      </H3>
                      <Hyperlink
                        linkStyle={{color: '#606aa1'}}
                        onPress={url => Linking.openURL(url)}>
                        <Text note style={{marginBottom: 10}}>
                          {item.highlightsHtml
                            .split('<p>')
                            .join('')
                            .split('</p>') || ''}
                        </Text>
                      </Hyperlink>
                      <Text note style={{marginBottom: 5}}>{`${moment(
                        item.startAt || new Date(),
                      ).format('MMM Do h:mm a')} - ${moment(
                        item.endAt || new Date(),
                      ).format('MMM Do h:mm a')}`}</Text>
                    </Body>
                  </CardItem>
                  <CardItem style={{fontSize: 8}}>
                    <Button
                      transparent
                      dark
                      small
                      iconLeft
                      onPress={() => Linking.openURL(item.dealUrl)}>
                      <Icon name="pricetag" />
                      <Text>View Deal</Text>
                    </Button>
                    <Button
                      transparent
                      dark
                      small
                      iconLeft
                      onPress={() => {
                        this.props.likeDeal(item.uuid);
                      }}>
                      <Icon name="heart" />
                      <Text>
                        {get(this.props, ['counter', item.uuid, 'count'], 0)}
                      </Text>
                    </Button>
                    <Button
                      transparent
                      dark
                      small
                      iconLeft
                      onPress={() => {
                        this.props.navigation.navigate('CreateEvent', {
                          dealLink: dealUrl,
                        });
                      }}>
                      <Icon name="link" />
                      <Text>{'Create Event'}</Text>
                    </Button>
                  </CardItem>
                </Card>
              );
            }}
            keyExtractor={item => item.id}
          />
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
    sessionToken: authenticationSelector(state).sessionToken,
    loggedInUserId: userSelector(state).loggedInUserId,
    counter: dealsSelector(state).counter,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocalEvents);
