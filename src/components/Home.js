import React from 'react';
import { StyleSheet, Image, Platform, Linking, Alert, FlatList } from 'react-native';
import { Text, Card, CardItem, Thumbnail, Button, Icon, Left, Right, Body, Fab, Container, H3, Badge, Picker } from 'native-base';
import moment from 'moment';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import Loading from './Loading';
import eventsSelector from '../selectors/events';
import userSelector from '../selectors/users';
import notificationsSelector from '../selectors/notifications';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

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

    confirmDeleteEvent(event) {
        Alert.alert(
            'Delete Event',
            `This event has ended. Would you like to delete it?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.deleteEvent(event);
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
        if(isCreator === true && new Date() <= new Date(item.endDatetime)){
            return (
                <Button transparent small dark iconLeft onPress={() => {
                    this.props.navigation.navigate('CreateEvent', {
                        existingEvent: item,
                    });
                }}>
                    <Icon name="create" />
                    <Text>Edit</Text>
                </Button>
            )
        }
        else if(isCreator === true && new Date() > new Date(item.endDatetime)){
            return (
                <Button transparent small danger iconLeft onPress={() => {
                    this.confirmDeleteEvent(item);
                }}>
                    <Icon name="trash" />
                    <Text>Delete</Text>
                </Button>
            )
        }
    }

    getNotificationsBadge() {
        if(this.props.badgeCount > 0){
            return (
                <React.Fragment>
                    <Badge style={{ position: 'absolute' }}><Text>{this.props.badgeCount}</Text></Badge>
                    <Icon style={{fontSize: 30}} name='notifications' />
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <Icon style={{fontSize: 30}} name='notifications' />
            </React.Fragment>            
        )
    }

    // Fallback to a static map image if no photo references available
    getPlaceImage(itemLocation) {
        const photos = get(itemLocation, 'photos', []);
        if(photos.length === 0){
            return (
                <Image source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${itemLocation.formatted_address}&zoom=18&size=100x100&maptype=roadmap&key=${GOOGLE_API_KEY}`
                }} style={{height: 100, width: 100, borderRadius: 5, flex: 1}}/>
            )
        }
        return (
            <Image source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${GOOGLE_API_KEY}`
            }} style={{height: 100, width: 100, borderRadius: 5, flex: 1}}/>
        )
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
                <Container>
                    <FlatList
                        data={this.props.eventList.sort(function(a,b){
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(a.startDatetime) - new Date(b.startDatetime);
                        })}
                        onRefresh={() => { this.props.getEvents(true) }}
                        refreshing={this.props.fetchingNew}
                        renderItem={({ item }) => {
                            const isCreator = (item.userId === this.props.loggedInUserId);
                            return (
                                <Card style={styles.center} key={item.eventId}>
                                    {this.getHeader(isCreator, item)}
                                    <CardItem>
                                        <Body>
                                            <H3 style={{color: '#58534d', marginBottom: 5}}>{item.title}</H3>
                                            <Text note style={{marginBottom: 5}}>{item.details || ''}</Text>
                                            <Text note style={{marginBottom: 5}}>{`Starts: ${moment(item.startDatetime).format("MMM Do h:mm a")}`}</Text>
                                            <Text note style={{marginBottom: 5}}>{`Ends: ${moment(item.endDatetime).format("MMM Do h:mm a")}`}</Text>
                                            {this.getEventEndedMessage(item.endDatetime)}
                                        </Body>
                                        <Right>
                                            {this.getPlaceImage(item.location)}
                                        </Right>
                                    </CardItem>
                                    <CardItem style={{fontSize: 10}}>
                                        <Button transparent dark small iconLeft onPress={() => {
                                            this.props.navigation.navigate('GuestList', {
                                                event: item,
                                                isCreator,
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
                                        {this.getFooter(isCreator, item)}
                                    </CardItem>
                                </Card>
                            )
                        }}
                        keyExtractor={item => item.eventId}
                    />
                </Container>
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
                    <Container>
                        <Card transparent style={styles.mainHeader}>
                            <CardItem transparent>
                                <Left>
                                    <Button transparent dark style={{fontSize: 14}} onPress={() => {
                                        this.props.navigation.navigate('Notifications')
                                    }}>
                                        {this.getNotificationsBadge()}
                                    </Button>
                                </Left>
                                <Picker
                                        mode='dropdown'
                                        iosHeader='Filter'
                                        iosIcon={<Icon name='funnel' dark />}
                                        style={{ width: undefined }}
                                        selectedValue={this.props.eventsFilter || 'upcoming'}
                                        onValueChange={(filter) => {
                                            this.props.changeEventsFilter(filter);
                                        }}
                                    >
                                        <Picker.Item label='Upcoming' value='upcoming' />
                                        <Picker.Item label='Past' value='past' />
                                        <Picker.Item label='Created By Me' value='created' />
                                        <Picker.Item label='Joined By Me' value="joined" />
                                    </Picker>
                            </CardItem>
                        </Card>
                        {this.getContent()}
                    </Container>   
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
        fetchingNew: eventsSelector(state).fetchingNew,
        sliderIndex: eventsSelector(state).sliderIndex,
        eventsFilter: eventsSelector(state).eventsFilter,
        loggedInUserId: userSelector(state).loggedInUserId,
        loggedInDisplayName: userSelector(state).loggedInDisplayName,
        loggedInProfilePic: userSelector(state).loggedInProfilePic,
        badgeCount: notificationsSelector(state).badgeCount,
    }    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);