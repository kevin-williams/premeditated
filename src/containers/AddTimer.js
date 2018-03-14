import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Audio } from 'expo';

import TimeSelect from '../components/TimeSelect';

const MILLIS_PER_MINUTE = 2000; // 2 secs for testing
// const MILLIS_PER_MINUTE = 60000;

const bellSound = require('../../assets/sound/gong.mp3');
const tingSound = require('../../assets/sound/ting.mp3');

const endSound = new Audio.Sound();
const intervalSound = new Audio.Sound();

export default class AddTimer extends Component {
  state = {
    selectedHours: 0,
    selectedMinutes: 3,
    intervalHours: 0,
    intervalMinutes: 1,
    timerId: undefined,
    intervalId: undefined
  };

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
    endSound.loadAsync(bellSound);
    intervalSound.loadAsync(tingSound);
  }

  componentWillUnmount() {
    clearTimeout(this.state.timerId);
    clearInterval(this.state.intervalId);
  }

  startTimer() {
    console.log('starting timer');
    const timerId = setTimeout(() => {
      this.endTimer();
    }, this.state.selectedMinutes * MILLIS_PER_MINUTE);
    this.setState({ timerId });

    if (this.state.intervalMinutes > 0) {
      const intervalId = setInterval(() => {
        this.intervalTimer();
      }, this.state.intervalMinutes * MILLIS_PER_MINUTE);

      this.setState({ intervalId });
    }
  }

  endTimer() {
    console.log('Timer went off');
    endSound.playAsync();
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: undefined });
  }

  intervalTimer() {
    console.log('Interval Timer went off');
    intervalSound.replayAsync();
  }

  render() {
    const {
      selectedHours,
      selectedMinutes,
      intervalHours,
      intervalMinutes
    } = this.state;

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

        <TimeSelect
          label="Interval"
          hours={intervalHours}
          minutes={intervalMinutes}
          onTimeSelected={time => {
            console.log('change interval=', time);
            this.setState({
              intervalHours: time.hours,
              intervalMinutes: time.minutes
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
