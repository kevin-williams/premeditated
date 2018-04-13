import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { SCREEN_WIDTH } from '../utils';

import { expo } from '../../app.json';
import { backgroundSounds } from '../../assets/sound/background/background_sounds';
import { sounds } from '../../assets/sound/sounds';

const TITLE_IMAGE = require('../../assets/PremeditatedTitle.png');

export default class BackgroundSelection extends Component {
  renderSounds() {
    const mySounds = sounds
      .concat(backgroundSounds)
      .filter(
        sound => !sound.name.startsWith('Vibrate') && sound.name !== 'None'
      );

    return mySounds.map(sound => (
      <Text key={sound.name} style={styles.soundText}>
        {`${sound.name} - ${sound.license}`}
      </Text>
    ));
  }

  render() {
    return (
      <ImageBackground
        source={this.props.selectedBackground.uri}
        style={styles.mainView}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <Image
            style={styles.title}
            source={TITLE_IMAGE}
            resizeMode="contain"
          />
          <Avatar
            small
            rounded
            icon={{ name: 'close' }}
            onPress={this.props.onClose.bind(this)}
            activeOpacity={0.7}
            containerStyle={styles.closeButton}
          />
        </View>
        <Text style={styles.text}>Version: {expo.version}</Text>
        <ScrollView style={styles.soundContainer}>
          {this.renderSounds()}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = {
  mainView: {
    flexDirection: 'column',
    backgroundColor: 'grey',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 25
  },
  text: {
    backgroundColor: 'rgba(222,222,222,0.7)',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 10,
    margin: 10,
    padding: 10
  },

  soundText: {
    backgroundColor: 'rgba(0,122,222,0.7)',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 10,
    margin: 10,
    padding: 10
  },

  spacer: { flex: 5 },
  headerContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    margin: 5
  },
  currentImage: {
    flex: 1
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  },
  closeButton: {
    backgroundColor: 'rgba(222, 0, 0, 0.6)',
    alignSelf: 'center'
  },
  cardStyle: {
    width: SCREEN_WIDTH,
    flex: 1
  }
};

BackgroundSelection.propTypes = {
  selectedBackground: PropTypes.object,
  onClose: PropTypes.func.isRequired
};
