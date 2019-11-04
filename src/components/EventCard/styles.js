import {StyleSheet, Dimensions} from 'react-native';

const imageWidth = Math.round(Dimensions.get('window').width * 0.9);
const imageHeight = Math.round(imageWidth / 2);

export default StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  headerProfilePic: {
    width: 60,
    height: 60,
  },
  title: {
    color: '#58534d',
    marginBottom: 5,
  },
  link: {
    color: '#606aa1',
  },
  details: {
    marginBottom: 10,
  },
  date: {
    marginBottom: 5,
  },
  buttons: {
    fontSize: 8,
  },
  locationName: {
    maxWidth: 200,
    flexWrap: 'wrap',
  },
  mapImage: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: 5,
    flex: 1,
  },
  locationImage: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: 5,
    flex: 1,
    resizeMode: 'center',
  },
  endMessage: {
    marginBottom: 5,
    color: '#e05319',
  },
});
