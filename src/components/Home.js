import React from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { StyleSheet, Image, Dimensions, Platform, Linking } from 'react-native';
import { Content, Text, Card, CardItem, Thumbnail, Button, Icon, Left, Right, Body } from 'native-base';
import moment from 'moment';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import Loading from './Loading';
import eventsSelector from '../selectors/events';
import userSelector from '../selectors/users';

const horizontalMargin = 20;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;

const GOOGLE_API_KEY = '';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePic: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: 'grey',
    },
});

class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activeSlideIndex: 0,
        }
    }

    componentDidMount() {
        this.props.getEvents();
    }

    getDeleteButton(canDeleteEvent = false, eventId) {
        if(canDeleteEvent){
            return (
                <CardItem>
                    <Button transparent danger onPress={() => {
                        this.props.deleteEvent(eventId);
                    }}>
                        <Text>
                            Delete Event
                        </Text>
                    </Button>
                </CardItem>
            )
        }
    }

    openMaps(label, lat, lng) {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url); 
    }

    get pagination () {
        return (
            <Pagination
                dotsLength={this.props.eventList.length}
                activeDotIndex={this.state.activeSlideIndex}
                containerStyle={{ backgroundColor: 'transparent' }}
                dotStyle={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#8c9199'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        )
    }

    getContent() {
        if(this.props.eventList === null){
            return <Loading message='Loading your friends latest open invites... Please wait.'/>;
        }
        else if(this.props.eventList.length > 0){
            return (
                <Content>
                    <Carousel
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.props.eventList}
                        onSnapToItem={(index) => this.setState({ activeSlideIndex: index }) }
                        renderItem={({item, index}) => {
                            return (
                                <Card style={styles.center}>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{uri: item.associatedUserProfile.profilePic}} />
                                            <Body>
                                                <Text>{item.title}</Text>
                                                <Text note>Host: {item.associatedUserProfile.displayName || item.associatedUserProfile.username}</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
                                    <CardItem>
                                        <Text note>{`${moment(item.startDatetime).format("MMM Do h:mm a")} - ${moment(item.endDatetime).format("MMM Do h:mm a")}`}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Text note>{item.details}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <Image source={{
                                                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${item.location.formatted_address}&zoom=18&size=280x260&maptype=roadmap&key=${GOOGLE_API_KEY}`
                                            }} style={{height: 260, width: 280, flex: 1}}/>
                                        </Body>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Button transparent onPress={() => {
                                                this.props.navigation.navigate('GuestList', {
                                                    eventId: item.eventId,
                                                    guestList: get(item, 'guestList', [])
                                                });
                                            }}>
                                            <Icon name="people" />
                                            <Text>{get(item, 'guestList', []).length} joined</Text>
                                            </Button>
                                        </Left>
                                        <Right>
                                            <Button 
                                                onPress={() => {
                                                    this.openMaps(item.location.name, item.location.geometry.location.lat, item.location.geometry.location.lng)
                                                }} 
                                                transparent 
                                                textStyle={{color: 'red'}}>
                                                <Icon name="navigate" />
                                                <Text>{item.location.name}</Text>
                                            </Button>
                                        </Right>
                                    </CardItem>
                                    {this.getDeleteButton(item.userId === this.props.loggedInUserId, item.eventId)}
                                </Card>
                            )
                        }}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                    />
                    { this.pagination }
                </Content>
            )
        }
        return (
            <Card style={styles.center}>
                <CardItem transparent header>
                    <Text>No open invtes. When your friends create some we will show them here.</Text>
                </CardItem>
            </Card> 
        )
    }

    render() {
        return (
            <Content>
                {this.getContent()}
            </Content>
        )   
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        eventList: eventsSelector(state).eventList,
        sliderIndex: eventsSelector(state).sliderIndex,
        loggedInUserId: userSelector(state).loggedInUserId,
    }    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);