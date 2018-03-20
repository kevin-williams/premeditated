import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { Audio } from 'expo';
import moment from 'moment';

import { stopSelectedTimer } from './timerActions';

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

  state = {
    isRunning: false,
    mainTimer: null,
    remainingTimer: null,
    intervalTimers: []
  };

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
  }

  componentWillUnmount() {
    // clearTimeout(this.props.timer.runningTimer.timerId);
    // clearInterval(this.props.timer.runningTimer.intervalId);
  }

  startTimer() {
    // const millisPerMinute = this.props.timer.runningTimer.test
    //   ? TEST_MILLIS_PER_MINUTE
    //   : MILLIS_PER_MINUTE;
    // console.log('starting timer');
    // const timerId = setTimeout(() => {
    //   this.endTimer();
    // }, this.props.timer.runningTimer.selectedMinutes * millisPerMinute);
    // // this.props.updateTimer({ ...this.props.timer.runningTimer, timerId });
    // if (this.props.timer.runningTimer.intervalMinutes > 0) {
    //   const intervalId = setInterval(() => {
    //     this.intervalTimer();
    //   }, this.props.timer.runningTimer.intervalMinutes * millisPerMinute);
    // this.props.updateTimer({ ...this.props.timer.runningTimer, intervalId });
    // }
  }

  endTimer() {
    // console.log('Timer went off');
    // endSound.playAsync();
    // clearInterval(this.props.timer.runningTimer.intervalId);
    // clearTimeout(this.props.timer.runningTimer.timerId);
    // this.props.updateTimer({
    //   ...this.props.timer.runningTimer,
    //   timerId: undefined,
    //   intervalId: undefined
    // });
    // this.props.stopSelectedTimer();
  }

  intervalTimer() {
    // console.log('Interval Timer went off');
    // intervalSound.replayAsync();
  }

  handleClose() {
    console.log('close');
    this.props.stopSelectedTimer();
  }

  handleStartStop() {
    console.log('stop');
    const { isRunning, firstTime, mainTimer, intervalTimer } = this.state;
    this.setState({ isRunning: !isRunning });

    // Stop pressed
    if (isRunning) {
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    } else {
      // Start pressed
      this.setState({ mainTimerStart: moment(), isRunning: true });

      this.interval = setInterval(() => {
        this.setState({
          mainTimer: moment() - this.state.mainTimerStart + mainTimer
        });
      }, 30);
    }
  }

  handleReset() {
    console.log('reset timer');
  }

  renderButtons() {
    const stopStyle = this.state.isRunning
      ? styles.stopButton
      : styles.startButton;
    const stopText = this.state.isRunning ? 'Stop' : 'Start';

    return (
      <View style={styles.buttonWrapper}>
        <TouchableHighlight
          underlayColor="#777"
          onPress={this.handleStartStop.bind(this)}
          style={styles.button}
        >
          <Text style={stopStyle}>{stopText}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#777"
          onPress={this.handleReset.bind(this)}
          style={styles.button}
        >
          <Text>Reset</Text>
        </TouchableHighlight>
      </View>
    );
  }

  formatTime(milliseconds) {
    if (!milliseconds) {
      return '00:00';
    }
    return moment(milliseconds).format('mm:ss');
  }

  renderTimers() {
    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerWrapper}>
          <Text style={styles.mainTimer}>
            {this.formatTime(this.state.mainTimer)}
          </Text>
          <Text style={styles.remainingTimer}>
            {this.formatTime(this.state.remainingTimer)}
          </Text>
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
    borderTopWidth: 0.5,
    flex: 2,
    backgroundColor: '#F2F2F2'
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
    backgroundColor: 'white',
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
