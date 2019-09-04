import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { Content, Card, CardItem, Item, Input, Text, Button, Form, Label, Textarea, H1 } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import usersSelector from '../selectors/users';
import formsSelector from '../selectors/forms';

import EditUserInfoModal from './BasicModal';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBar: {
        marginTop: '20%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profile: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: 'grey',
    },
    availabilityIcon: {
        color: 'grey',
        fontSize: 150,
    },
    textArea: {
        width: '100%'
    },
    sendFeedbackBtn: {
        width: '80%'
    }
});

class Profile extends React.Component {

    componentDidMount() {
        this.props.getLoggedInUserInfo();
    }

    handleChangeText(input, prop) {
        if(prop === 'status'){
            this.props.updateStatus(input);
        }
        else if(prop === 'location'){
            this.props.updateLocation(input);
        }
    }

    handleUploadPicture() {

        // this.props.showLoader();

        ImagePicker.showImagePicker({}, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled image picker');
                // this.props.hideLoader();
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                // this.props.hideLoader();
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this.props.hideLoader();
            }
            else {
                let source = { uri: 'data:image/jpeg;base64,' + response.data };
                // this.props.hideLoader();
                this.props.updateUserInfo({profilePic: source.uri});
            }
        });
    }

    render() {
        return (
            <Content>
                <EditUserInfoModal
                    isOpen={this.props.editUserInfoModalOpen}
                    onRequestClose={() => { this.props.closeEditUserInfoModal() }}
                    content={
                        <View>
                            <Form>
                                <Item stackedLabel>
                                    <Label>Display Name</Label>
                                    <Input 
                                        placeholder={'Enter a display name'} 
                                        value={this.props.edittedDisplayName} 
                                        onChangeText={(text) => { this.props.changedDisplayNameText(text) }}
                                    />
                                </Item>
                                    <Item stackedLabel last>
                                        <Label>Username</Label>
                                        <Input 
                                            placeholder={'Enter a username'} 
                                            value={this.props.edittedUsername.toLowerCase()} 
                                            onChangeText={(text) => { this.props.changedUsernameText(text) }}
                                        />
                                    </Item>
                            </Form>
                            <View style={styles.buttonBar}>
                                <Button danger transparent onPress={() => { this.props.closeEditUserInfoModal() }}>
                                    <Text>Cancel</Text>
                                </Button>
                                <Button transparent onPress={() => {
                                    this.props.updateUserInfo({
                                        username: this.props.edittedUsername.toLowerCase(),
                                        displayName: this.props.edittedDisplayName,
                                    }) 
                                }}>
                                    <Text>Save</Text>
                                </Button>
                            </View>
                        </View>
                    }
                />
                <Card style={styles.center}>
                    <CardItem transparent header>
                        <TouchableOpacity onPress={() => {this.handleUploadPicture()}}>
                            <Image
                                style={styles.profile}  
                                source={{uri: this.props.loggedInProfilePic}} />  
                        </TouchableOpacity>
                    </CardItem>
                    <CardItem transparent>
                        <Text>{this.props.loggedInDisplayName || this.props.loggedInUsername}</Text>
                        <Button transparent onPress={() => { this.props.openEditUserInfoModal() }}><Text>Edit</Text></Button>
                    </CardItem>
                </Card>
                <Card transparent style={styles.center}>
                    <CardItem header>
                        <H1>Welcome to Flaker</H1>
                    </CardItem>
                    <CardItem>
                        <Textarea 
                            style={styles.textArea} 
                            value={get(this.props, 'appFeedback.feedback', '')}
                            rowSpan={3} 
                            bordered
                            onChangeText={(value) => { this.props.inputChange('appFeedback.feedback', value); }} 
                            placeholder="Hello early adopters! Please drop app feedback or issues here..." />
                    </CardItem>
                    <CardItem footer>
                        <Button onPress={() => { this.props.sendAppFeedback(); }} style={styles.sendFeedbackBtn} block warning><Text>Send</Text></Button>
                    </CardItem>
                </Card>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        loggedInUsername: usersSelector(state).loggedInUsername,
        loggedInDisplayName: usersSelector(state).loggedInDisplayName,
        loggedInProfilePic: usersSelector(state).loggedInProfilePic,
        editUserInfoModalOpen: usersSelector(state).editUserInfoModalOpen,
        edittedUsername: usersSelector(state).edittedUsername,
        edittedDisplayName: usersSelector(state).edittedDisplayName,
        appFeedback: formsSelector(state).appFeedback,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);