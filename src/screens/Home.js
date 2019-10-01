import React from 'react';
import { StyleSheet, Image, Platform, Linking, Alert, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Fab, Container, H3, Badge, Picker } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import get from 'lodash/get';
import firebase from 'react-native-firebase';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import ProfilePreviewModal from '../components/ProfilePreviewModal';
import Loading from '../components/Loading';

import eventsSelector from '../selectors/events';
import userSelector from '../selectors/users';
import notificationsSelector from '../selectors/notifications';
import authenticationSelector from '../selectors/authentication';
import friendsSelector from '../selectors/friends';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

request.addKeyword('events');
request.addKeyword('social');
request.addKeyword('party');
request.addKeyword('nightlife');
request.addKeyword('dining');

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

    componentDidMount() {
        if(this.props.sessionToken !== '' && this.props.sessionToken !== null){
            this.props.getEvents();
            this.props.getNotifications();
        }
    }

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
                        <TouchableOpacity onPress={() => {
                            this.props.showProfilePreviewModal(item.associatedUserProfile, true);
                        }}>
                            <Thumbnail source={{uri: item.associatedUserProfile.profilePic}} />
                        </TouchableOpacity>
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

    getNavigationButton(isCreator, item) {
        if(isCreator === false){
            return (
                <Button transparent dark small iconLeft onPress={() => {
                    this.openMaps(item.location.name, item.location.geometry.location.lat, item.location.geometry.location.lng)
                }}>
                    <Icon name="navigate" />
                    <Text style={{maxWidth: 200, flexWrap: 'wrap'}}>{item.location.name}</Text>
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
        const imageWidth = Math.round(Dimensions.get('window').width * .9);
        const imageHeight = Math.round(imageWidth / 2);
        let bestPhotos = null;
        const photos = get(itemLocation, 'photos', []).sort((imageA, imageB) => {
            return (((imageHeight/imageWidth) - (imageB.height/imageB.width)) - ((imageHeight/imageWidth) - (imageA.height/imageA.width)))
        });

        const filteredPhotos = photos.filter((photo) => {
            return photo.height > imageHeight && photo.width > imageWidth;
        })

        if(filteredPhotos.length > 0){
            bestPhotos = filteredPhotos;
        }
        else{
            bestPhotos = photos;
        }

        if(bestPhotos.length === 0){
            return (
                <Image source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${itemLocation.formatted_address}&zoom=18&size=${imageWidth}x${imageHeight}&maptype=roadmap&key=${GOOGLE_API_KEY}`
                }} style={{height: imageHeight, width: imageWidth, borderRadius: 5, flex: 1}}/>
            )
        }
        return (
            <Image source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${bestPhotos[0].photo_reference}&maxheight=${imageHeight}&maxwidth=${imageWidth}&key=${GOOGLE_API_KEY}`
            }} style={{height: imageHeight, width: imageWidth, borderRadius: 5, flex: 1}}/>
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

    getBannerUnitId(){
        if(__DEV__){
            return 'ca-app-pub-3940256099942544/6300978111';
        }
        else if(Platform.OS === 'android'){
            return 'ca-app-pub-9804482407199604/7027103890';
        }
        return 'ca-app-pub-9804482407199604/4029760684';
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
                                            {this.getPlaceImage(item.location)}
                                        </Body>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <H3 style={{color: '#58534d', marginBottom: 5}}>{item.title}</H3>
                                            <Hyperlink linkStyle={ { color: '#606aa1' } } onPress={ (url) => Linking.openURL(url) }>
                                                <Text note style={{marginBottom: 10}}>{item.details || ''}</Text>
                                            </Hyperlink>
                                            <Text note style={{marginBottom: 5}}>{`${moment(item.startDatetime).format("MMM Do h:mm a")} - ${moment(item.endDatetime).format("MMM Do h:mm a")}`}</Text>
                                            {this.getEventEndedMessage(item.endDatetime)}
                                        </Body>
                                    </CardItem>
                                    <CardItem style={{fontSize: 8}}>
                                        <Button transparent dark small iconLeft onPress={() => {
                                            this.props.navigation.navigate('Comments', {
                                                event: item,
                                                isCreator,
                                            });
                                        }}>
                                            <Icon name="chatboxes" />
                                            <Text>{get(item, 'commentCount', 0)}</Text>
                                        </Button>
                                        <Button transparent dark small iconLeft onPress={() => {
                                            this.props.navigation.navigate('GuestList', {
                                                event: item,
                                                isCreator,
                                            });
                                        }}>
                                            <Icon name="people" />
                                            <Text>{get(item, 'guestListCount', 0)}</Text>
                                        </Button>
                                        {this.getNavigationButton(isCreator, item)}
                                        {this.getFooter(isCreator, item)}
                                    </CardItem>
                                </Card>
                            )
                        }}
                        keyExtractor={item => item.eventId}
                    />
                    <Banner
                        unitId={this.getBannerUnitId()}
                        size={'FULL_BANNER'}
                        request={request.build()}
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
                                    <Button transparent dark style={{fontSize: 10}} onPress={() => {
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
                        active={false}
                        direction="left"
                        containerStyle={{ }}
                        style={{ backgroundColor: 'orange' }}
                        position="bottomRight"
                        onPress={() => {
                            this.props.navigation.navigate('CreateEvent');
                        }}>
                        <Icon name="add" />
                    </Fab>
                </Container>
                <ProfilePreviewModal 
                    isOpen={this.props.profilePreviewModalVisible}
                    onRequestClose={this.props.closeProfilePreviewModal}
                    profile={this.props.profileToPreview}
                    friendStatus={this.props.friendStatus}
                    removeFriend={this.props.removeFriend.bind(this)}
                />
            </React.Fragment>
        )   
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        sessionToken: authenticationSelector(state).sessionToken,
        eventList: eventsSelector(state).eventList,
        fetchingNew: eventsSelector(state).fetchingNew,
        sliderIndex: eventsSelector(state).sliderIndex,
        eventsFilter: eventsSelector(state).eventsFilter,
        loggedInUserId: userSelector(state).loggedInUserId,
        loggedInDisplayName: userSelector(state).loggedInDisplayName,
        loggedInProfilePic: userSelector(state).loggedInProfilePic,
        badgeCount: notificationsSelector(state).badgeCount,
        profilePreviewModalVisible: friendsSelector(state).profilePreviewModalVisible,
        profileToPreview: friendsSelector(state).profileToPreview,
        friendStatus: friendsSelector(state).friendStatus
    }    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);