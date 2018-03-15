import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Audio } from 'expo';

import TimeSelect from '../../components/TimeSelect';
import { updateTimer } from './timerActions';

const MILLIS_PER_MINUTE = 2000; // 2 secs for testing
// const MILLIS_PER_MINUTE = 60000;

const bellSound = require('../../../assets/sound/gong.mp3');
const tingSound = require('../../../assets/sound/ting.mp3');

const endSound = new Audio.Sound();
const intervalSound = new Audio.Sound();

class AddTimer extends Component {
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
    clearTimeout(this.props.timer.selectedTimer.timerId);
    clearInterval(this.props.timer.selectedTimer.intervalId);
  }

  startTimer() {
    console.log('starting timer');
    const timerId = setTimeout(() => {
      this.endTimer();
    }, this.props.timer.selectedTimer.selectedMinutes * MILLIS_PER_MINUTE);

    this.props.updateTimer({ ...this.props.timer.selectedTimer, timerId });

    if (this.props.timer.selectedTimer.intervalMinutes > 0) {
      const intervalId = setInterval(() => {
        this.intervalTimer();
      }, this.props.timer.selectedTimer.intervalMinutes * MILLIS_PER_MINUTE);

      this.props.updateTimer({ ...this.props.timer.selectedTimer, intervalId });
    }
  }

  endTimer() {
    console.log('Timer went off');
    endSound.playAsync();
    clearInterval(this.props.timer.selectedTimer.intervalId);
    this.props.updateTimer({
      ...this.props.timer.selectedTimer,
      intervalId: undefined
    });
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
    } = this.props.timer.selectedTimer;

    return (
      <View style={styles.container}>
        <TimeSelect
          label="Duration"
          hours={selectedHours}
          minutes={selectedMinutes}
          onTimeSelected={time => {
            console.log('change time=', time);
            this.props.updateTimer({
              ...this.props.timer.selectedTimer,
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
            this.props.updateTimer({
              ...this.props.timer.selectedTimer,
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

const mapStateToProps = state => state;
export default connect(mapStateToProps, { updateTimer })(AddTimer);
