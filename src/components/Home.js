import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform, Linking, Alert } from 'react-native';
import { Content, Text, Card, CardItem, Thumbnail, Button, Icon, Left, Right, Body, Fab, Container, H1, H3 } from 'native-base';
import moment from 'moment';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import Loading from './Loading';
import eventsSelector from '../selectors/events';
import userSelector from '../selectors/users';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePic: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 0,
        borderColor: 'grey',
    },
    headerProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 0,
        borderColor: 'grey',
    },
});

class Home extends React.Component {

    static navigationOptions = {
        header: {
            visible: false
        }
    };

    confirmDeleteEvent(eventId) {
        Alert.alert(
            'Delete Event',
            `Are you sure you want to delete this event?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.deleteEvent(eventId);
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    getHeader(isCreator = false, item){
        if(isCreator === false){
            return (
                <CardItem>
                    <Left>
                        <Thumbnail source={{uri: item.associatedUserProfile.profilePic}} />
                        <Body>
                            <Text note>Host: {item.associatedUserProfile.displayName || item.associatedUserProfile.username}</Text>
                        </Body>
                    </Left>
                </CardItem>
            )
        }
    }

    getEventEndedMessage(endDatetime){
        if(new Date() > new Date(endDatetime)){
            return (
                <Text note style={{marginBottom: 5, color: '#e05319'}}>{`This event has ended.`}</Text>
            )
        }
    }

    getFooter(isCreator = false, item) {
        if(isCreator === true){
            return (
                <Button transparent danger small iconLeft onPress={() => {
                    this.confirmDeleteEvent(item.eventId);
                }}>
                    <Icon name="trash" />
                    <Text>Delete</Text>
                </Button>
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

    getContent() {
        if(this.props.eventList === null){
            return <Loading message='Loading latest updates... Please wait.'/>;
        }
        else if(this.props.eventList.length > 0){
            return (
                <Content>
                {
                    this.props.eventList.sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(a.startDatetime) - new Date(b.startDatetime);
                      }).map((item, index) => {
                        return(
                            <Card style={styles.center} key={index}>
                                {this.getHeader(item.userId === this.props.loggedInUserId, item)}
                                <CardItem>
                                    <Body>
                                        <H3 style={{color: '#58534d', marginBottom: 5}}>{item.title}</H3>
                                        <Text note style={{marginBottom: 5}}>{item.details || ''}</Text>
                                        <Text note style={{marginBottom: 5}}>{`Starts: ${moment(item.startDatetime).format("MMM Do h:mm a")}`}</Text>
                                        <Text note style={{marginBottom: 5}}>{`Ends: ${moment(item.endDatetime).format("MMM Do h:mm a")}`}</Text>
                                        {this.getEventEndedMessage(item.endDatetime)}
                                    </Body>
                                    <Right>
                                        <Image source={{
                                                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${item.location.formatted_address}&zoom=18&size=100x100&maptype=roadmap&key=${GOOGLE_API_KEY}`
                                            }} style={{height: 100, width: 100, borderRadius: 5, flex: 1}}/>
                                    </Right>
                                </CardItem>
                                <CardItem style={{fontSize: 10}}>
                                    <Button transparent dark small iconLeft onPress={() => {
                                        this.props.navigation.navigate('GuestList', {
                                            eventId: item.eventId,
                                            guestList: get(item, 'guestList', [])
                                        });
                                    }}>
                                        <Icon name="people" />
                                        <Text>{get(item, 'guestList', []).length}</Text>
                                    </Button>
                                    <Button transparent dark small iconLeft onPress={() => {
                                        this.openMaps(item.location.name, item.location.geometry.location.lat, item.location.geometry.location.lng)
                                    }}>
                                        <Icon name="navigate" />
                                        <Text style={{maxWidth: 200, flexWrap: 'wrap'}}>{item.location.name}</Text>
                                    </Button>
                                    {this.getFooter(item.userId === this.props.loggedInUserId, item)}
                                </CardItem>
                            </Card>
                        )
                    })
                }
                </Content>
            )
        }
        return (
            <Card transparent style={styles.center}>
                <CardItem transparent header>
                    <Text>No open invites. When your friends create some we will show them here.</Text>
                </CardItem>
            </Card> 
        )
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    <Content>
                        <Card transparent style={styles.mainHeader}>
                            <CardItem transparent>
                                <Left>
                                    {/* <Button transparent dark onPress={() => { 'Send toast to sort' }}>
                                        <Icon name='list' />
                                    </Button> */}
                                </Left>
                                <Body>
                                    <H1 style={{color: '#f58b07d6'}}>Flaker</H1>
                                </Body>
                                <Right>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('Profile');
                                }}>
                                    <Image
                                        style={styles.headerProfilePic}  
                                        source={{uri: this.props.loggedInProfilePic}} /> 
                                        <Text note>{this.props.loggedInDisplayName || 'Me'}</Text> 
                                </TouchableOpacity>
                                </Right>
                            </CardItem>
                        </Card>
                        {this.getContent()}
                    </Content>   
                        <Fab
                            active={true}
                            direction="up"
                            containerStyle={{ }}
                            style={{ backgroundColor: '#f58b07d6' }}
                            position="bottomRight"
                            onPress={() => {
                                this.props.navigation.navigate('CreateEvent');
                            }}>
                            <Icon name="add" />
                        </Fab>
                    </Container>
            </React.Fragment>
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
        loggedInDisplayName: userSelector(state).loggedInDisplayName,
        loggedInProfilePic: userSelector(state).loggedInProfilePic,
    }    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);