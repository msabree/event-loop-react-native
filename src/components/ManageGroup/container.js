import find from 'lodash/find';
import startCase from 'lodash/startCase';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {ActionCreators} from '../../actions';
import groupsSelector from '../../selectors/groups';
import friendsSelector from '../../selectors/friends';
import formSelector from '../../selectors/forms';
import ManageGroup from './component';

function mapDispatchToProps(dispatch) {
  return {
    saveGroup: () => {
      dispatch(ActionCreators.saveGroup());
      dispatch(ActionCreators.setSelectedFriendIds([]));
      dispatch(ActionCreators.setManageGroupModalVisible('', false));
    },
    cancel: () => {
      dispatch(ActionCreators.setSelectedFriendIds([]));
      dispatch(ActionCreators.setManageGroupModalVisible('', false));
    },
    titleChanged: title =>
      dispatch(ActionCreators.inputChange('manageGroups.title', title)),
    selectedFriendIdsChanged: friendIdsSelected =>
      dispatch(ActionCreators.setSelectedFriendIds(friendIdsSelected)),
  };
}

function mapStateToProps(state) {
  const edittedGroupTitle = formSelector(state).groupTitle;
  const modalVisible = groupsSelector(state).modalVisible;
  const selectedFriendIds = groupsSelector(state).selectedFriendIds;
  const groupIdSelected = groupsSelector(state).groupIdSelected;
  const existingGroups = groupsSelector(state).groups;
  const currentGroup = find(
    existingGroups,
    group => group.groupId === groupIdSelected,
  );
  const currentGroupFriendIds = get(currentGroup, 'members', []);
  const currentFriends = friendsSelector(state).current;
  const friendsInGroup = currentFriends.filter(friend => {
    return currentGroupFriendIds.indexOf(friend.friendUserId) !== -1;
  });
  const friendsNotInGroup = currentFriends.filter(friend => {
    return currentGroupFriendIds.indexOf(friend.friendUserId) === -1;
  });

  return {
    createMode: groupIdSelected.trim() === '',
    modalVisible,
    groupTitle:
      edittedGroupTitle === ''
        ? startCase(get(currentGroup, 'title', ''))
        : edittedGroupTitle,
    friendsInGroup,
    friendsNotInGroup,
    selectedFriendIds,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageGroup);
