import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, Text, View } from 'react-native';
import { Audio } from 'expo';

export default class SoundPicker extends Component {
  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
    });
  }

  async soundChanged(newSound) {
    console.log('selected sound=', newSound);

    const selectedSound = new Audio.Sound();

    try {
      await selectedSound.loadAsync(newSound.file);

      await selectedSound.playAsync();
      setTimeout(() => selectedSound.stopAsync(), 5000);
    } catch (error) {
      console.log('error loading sound', error);
    }
    this.props.onChange(newSound);
  }

  render() {
    return (
      <View style={{ width: 150 }}>
        <Text>{this.props.label}</Text>
        <Picker
          selectedValue={this.props.selectedSound}
          onValueChange={this.soundChanged.bind(this)}
        >
          {this.props.sounds.map((sound, index) => (
            <Picker.Item
              key={`Sound-${index}`}
              label={sound.name}
              value={sound}
            />
          ))}
        </Picker>
      </View>
    );
  }
}

SoundPicker.propTypes = {
  label: PropTypes.string,
  selectedSound: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  sounds: PropTypes.array.isRequired
};
