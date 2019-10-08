import React from 'react';
import { Thumbnail } from 'native-base';

export default class UserProfilePicture extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            profilePicLoading: {},
        }
    }

    render() {
        const { userId, profilePic } = this.props.profile;
        const profilePicObj = {uri: profilePic, cache: 'default'};
        const defaultPic = require('../images/default_profile_pic.png')
        const picSource = this.state.profilePicLoading[userId] !== false ? defaultPic : profilePicObj
        
        return (
            <Thumbnail 
                style={this.props.style}
                onLoadEnd={() => {
                    const picLoading = this.state.profilePicLoading;
                    picLoading[userId] = false;
                    this.setState({
                        profilePicLoading: picLoading
                    })
                }}
                source={picSource} 
            />
        )
    }
}
