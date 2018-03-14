import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Audio } from 'expo';

import TimeSelect from '../components/TimeSelect';

const MILLIS_PER_MINUTE = 2000; // 2 secs for testing
// const MILLIS_PER_MINUTE = 60000;

const bellSound = require('../../assets/sound/gong.mp3');
const sound = new Audio.Sound();

export default class AddTimer extends Component {
  state = {
    selectedHours: 0,
    selectedMinutes: 1,
    timerId: undefined
  };

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
    sound.loadAsync(bellSound);
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timerId);
  }

  startTimer() {
    console.log('starting timer');
    const timerId = setTimeout(() => {
      this.endTimer();
    }, this.state.selectedMinutes * MILLIS_PER_MINUTE);
    this.setState({ timerId });
  }

  endTimer() {
    console.log('Timer went off');
    sound.playAsync();
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <View style={styles.container}>
        <TimeSelect
          label="Duration"
          hours={selectedHours}
          minutes={selectedMinutes}
          onTimeSelected={time => {
            console.log('change time=', time);
            this.setState({
              selectedHours: time.hours,
              selectedMinutes: time.minutes
            });
          }}
        />

        <Button
          large
          title="Start"
          onPress={this.startTimer.bind(this)}
          backgroundColor="green"
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
