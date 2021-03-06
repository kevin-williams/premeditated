import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, Platform, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Audio, DocumentPicker } from 'expo';
import { ICONS } from '../utils';

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
    // console.log('selected sound=', newSound);
    this.props.onChange(newSound);

    const selectedSound = new Audio.Sound();

    try {
      await selectedSound.loadAsync(newSound.file);

      await selectedSound.playAsync();
      setTimeout(() => selectedSound.stopAsync(), 5000);
    } catch (error) {
      console.log('error loading sound', error);
    }
  }

  async selectSoundFromDevice() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      console.log('picked sound file=', result);

      this.soundChanged({
        name: result.name,
        file: { uri: result.uri },
        license: 'Local file'
      });
    } catch (error) {
      console.log('Error selecting sound file', error);
    }
  }

  render() {
    const pickerItems = this.props.sounds.map((sound, index) => (
      <Picker.Item key={`Sound-${index}`} label={sound.name} value={sound} />
    ));

    if (
      this.props.selectedSound &&
      this.props.selectedSound.file &&
      this.props.selectedSound.file.uri
    ) {
      pickerItems.push(
        <Picker.Item
          key={'Sound-User'}
          label={this.props.selectedSound.name}
          value={this.props.selectedSound}
        />
      );
    }

    return (
      <View style={styles.mainContainer}>
        <Text>{this.props.label}</Text>
        <View style={styles.rowStyle}>
          <Icon
            name={ICONS.MusicNote.name}
            type={ICONS.MusicNote.type}
            raised
            onPress={this.selectSoundFromDevice.bind(this)}
            size={18}
            color="#57bfea"
          />
          <Picker
            selectedValue={this.props.selectedSound}
            onValueChange={this.soundChanged.bind(this)}
            style={styles.picker}
            itemStyle={styles.itemPicker}
          >
            {pickerItems}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flexDirection: 'column'
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  picker: {
    width: 150,
    height: Platform.OS === 'ios' ? 88 : 50
  },
  itemPicker: {
    height: Platform.OS === 'ios' ? 88 : 50
  }
};

SoundPicker.propTypes = {
  label: PropTypes.string,
  selectedSound: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  sounds: PropTypes.array.isRequired
};
