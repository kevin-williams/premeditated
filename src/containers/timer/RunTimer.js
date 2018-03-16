import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Audio } from 'expo';
import { stopSelectedTimer, updateTimer } from './timerActions';

const TEST_MILLIS_PER_MINUTE = 2000; // 2 secs for testing
const MILLIS_PER_MINUTE = 60000;

const bellSound = require('../../../assets/sound/gong.mp3');
const tingSound = require('../../../assets/sound/ting.mp3');

const endSound = new Audio.Sound();
const intervalSound = new Audio.Sound();

class RunTimer extends Component {
  constructor(props) {
    super(props);
    endSound
      .loadAsync(bellSound)
      .then(console.log('sound loaded'))
      .catch(console.log('sound already loaded'));
    intervalSound
      .loadAsync(tingSound)
      .then(console.log('sound loaded'))
      .catch(console.log('sound already loaded'));
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.props.timer.selectedTimer.timerId);
    clearInterval(this.props.timer.selectedTimer.intervalId);
  }

  startTimer() {
    const millisPerMinute = this.props.timer.selectedTimer.test
      ? TEST_MILLIS_PER_MINUTE
      : MILLIS_PER_MINUTE;

    console.log('starting timer');
    const timerId = setTimeout(() => {
      this.endTimer();
    }, this.props.timer.selectedTimer.selectedMinutes * millisPerMinute);

    this.props.updateTimer({ ...this.props.timer.selectedTimer, timerId });

    if (this.props.timer.selectedTimer.intervalMinutes > 0) {
      const intervalId = setInterval(() => {
        this.intervalTimer();
      }, this.props.timer.selectedTimer.intervalMinutes * millisPerMinute);

      this.props.updateTimer({ ...this.props.timer.selectedTimer, intervalId });
    }
  }

  endTimer() {
    console.log('Timer went off');
    endSound.playAsync();
    clearInterval(this.props.timer.selectedTimer.intervalId);
    clearTimeout(this.props.timer.selectedTimer.timerId);
    this.props.updateTimer({
      ...this.props.timer.selectedTimer,
      timerId: undefined,
      intervalId: undefined
    });

    this.props.stopSelectedTimer();
  }

  intervalTimer() {
    console.log('Interval Timer went off');
    intervalSound.replayAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Timer running</Text>
        <Button
          large
          title="Stop"
          onPress={this.props.stopSelectedTimer}
          backgroundColor="red"
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
export default connect(mapStateToProps, { stopSelectedTimer, updateTimer })(
  RunTimer
);
