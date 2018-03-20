import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Audio } from 'expo';
import { stopSelectedTimer } from './timerActions';

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

  state = { isRunning: false };

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
    clearTimeout(this.props.timer.runningTimer.timerId);
    clearInterval(this.props.timer.runningTimer.intervalId);
  }

  startTimer() {
    const millisPerMinute = this.props.timer.runningTimer.test
      ? TEST_MILLIS_PER_MINUTE
      : MILLIS_PER_MINUTE;

    console.log('starting timer');
    const timerId = setTimeout(() => {
      this.endTimer();
    }, this.props.timer.runningTimer.selectedMinutes * millisPerMinute);

    // this.props.updateTimer({ ...this.props.timer.runningTimer, timerId });

    if (this.props.timer.runningTimer.intervalMinutes > 0) {
      const intervalId = setInterval(() => {
        this.intervalTimer();
      }, this.props.timer.runningTimer.intervalMinutes * millisPerMinute);

      // this.props.updateTimer({ ...this.props.timer.runningTimer, intervalId });
    }
  }

  endTimer() {
    console.log('Timer went off');
    endSound.playAsync();
    clearInterval(this.props.timer.runningTimer.intervalId);
    clearTimeout(this.props.timer.runningTimer.timerId);
    // this.props.updateTimer({
    //   ...this.props.timer.runningTimer,
    //   timerId: undefined,
    //   intervalId: undefined
    // });

    this.props.stopSelectedTimer();
  }

  intervalTimer() {
    console.log('Interval Timer went off');
    intervalSound.replayAsync();
  }

  handleClose() {
    console.log('close');
    this.props.stopSelectedTimer();
  }

  handleStop() {
    console.log('stop');
  }

  handlePause() {
    console.log('pause');
  }

  renderButtons() {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableHighlight
          underlayColor="#777"
          onPress={this.handleStop.bind(this)}
          style={styles.button}
        >
          <Text>Stop</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#777"
          onPress={this.handlePause.bind(this)}
          style={styles.button}
        >
          <Text>Pause</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderTimers() {
    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerWrapper}>
          <Text style={styles.mainTimer}>00:00.95</Text>
          <Text style={styles.remainingTimer}>00:28.45</Text>
        </View>
      </View>
    );
  }

  render() {
    const timer = this.props.timer.runningTimer;

    return (
      <Modal
        style={styles.modal}
        animationType="slide"
        tranparent={false}
        visible
        onRequestClose={() => console.log('close')}
      >
        <View style={styles.top}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{timer.title}</Text>
            <TouchableHighlight
              style={styles.closeButton}
              underlayColor="#777"
              onPress={this.handleClose.bind(this)}
            >
              <Text style={{ fontSize: 18 }}>X</Text>
            </TouchableHighlight>
          </View>
          {this.renderTimers()}
        </View>
        <View style={styles.bottom}>
          {this.renderButtons()}
          <Text style={styles.intervalTimer}>00:05.22</Text>
          <Text style={styles.intervalTimer}>00:10.22</Text>
        </View>
      </Modal>
    );
  }
}

const styles = {
  modal: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    flex: 1
  },
  headerContainer: {
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row'
  },
  timerContainer: {
    justifyContent: 'center'
  },
  timerWrapper: {
    alignSelf: 'center'
  },
  mainTimer: {
    fontSize: 60,
    fontWeight: '100',
    alignSelf: 'flex-end',
    padding: 5
  },
  remainingTimer: {
    fontSize: 40,
    alignSelf: 'flex-end',
    padding: 5
  },
  intervalTimer: {
    fontSize: 40,
    alignSelf: 'center',
    padding: 5
  },
  top: {
    flex: 1
  },
  bottom: {
    flex: 2
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 30
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },

  startButton: {
    color: '#00cc00'
  },
  stopButton: {
    color: 'red'
  },
  closeButton: {
    width: 40,
    height: 40
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { stopSelectedTimer })(RunTimer);
