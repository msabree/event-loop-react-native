import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const styles = StyleSheet.create({});

class SelectFriends extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <MultiSelect
          hideTags
          items={this.props.friends}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.props.onSelectedItemsChange}
          selectedItems={this.props.selectedItems}
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
        <View style={{fontSize: 20, marginBottom: 10}}>
          {this.multiselect ? this.multiselect.getSelectedItemsExt() : null}
        </View>
      </React.Fragment>
    );
  }
}

SelectFriends.propTypes = {};

SelectFriends.defaultProps = {};

export default SelectFriends;
