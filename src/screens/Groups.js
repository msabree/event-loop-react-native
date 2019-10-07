import React from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { StyleSheet, Dimensions } from 'react-native';
import { Container, Content, List, ListItem, Text, Fab, Icon, Item, Input, Body, Right, Button } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

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

    constructor(props){
        super(props);
        this.state = {
            activeSlideIndex: 0,
            groups: [],
        }
    }

    componentDidMount(){
        this.setState({
            groups: [{},{},{}],
        })
    }

    _renderItem ({item, index}) {
        return (
            <Content key={index}>
                <Button style={styles.center} danger transparent>
                    <Text>{'Delete Group'}</Text>
                </Button>
                <Item regular>
                    <Input placeholder='Enter a group name' />
                </Item>
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

    get pagination () {
        return (
            <Pagination
                dotsLength={this.state.groups.length}
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

    render() {
        return (
            <React.Fragment>
                <Container>
                    <Container>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.groups}
                            onSnapToItem={(index) => this.setState({ activeSlideIndex: index }) }
                            renderItem={this._renderItem}
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                        />
                        { this.pagination }
                    </Container>
                    <Fab
                        active={false}
                        direction="left"
                        containerStyle={{ }}
                        style={{ backgroundColor: 'orange' }}
                        position="bottomRight"
                        onPress={() => {}}>
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
    return {}    
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);