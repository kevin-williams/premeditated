import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Audio } from 'expo';
import moment from 'moment';

import { stopSelectedTimer } from './timerActions';

const MILLIS_PER_MINUTE = 60000;
const MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;

const bellSound = require('../../../assets/sound/gong.mp3');
const tingSound = require('../../../assets/sound/ting.mp3');

const endSound = new Audio.Sound();
const intervalSound = new Audio.Sound();

const DEFAULT_STATE = {
  isRunning: false,
  mainTimer: null,
  remainingTimer: null,
  intervalTimers: []
};

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

  state = DEFAULT_STATE;

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
    if (this.state.isRunning) {
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    }
  }

  endSound() {
    console.log('Play end sound');
    endSound.playAsync();
  }

  intervalSound() {
    console.log('Play interval sound');
    intervalSound.replayAsync();
  }

  handleEndTimer() {
    this.endSound();
    this.handleStartStop();
    // TODO Add "snooze" here to add time?
  }

  handleClose() {
    console.log('close');
    this.props.stopSelectedTimer();
  }

  handleStartStop() {
    console.log('stop');
    const { isRunning } = this.state;
    this.setState({ isRunning: !isRunning });

    // Stop pressed
    if (isRunning) {
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    } else {
      this.processStart();
    }
  }

  processStart() {
    // Start pressed
    const timer = this.props.timer.runningTimer;
    const { mainTimer } = this.state;

    const finalTime =
      timer.selectedMinutes * MILLIS_PER_MINUTE +
      timer.selectedHours * MILLIS_PER_HOUR;
    const intervalTimes = [];

    const intervalMillis = timer.intervalMinutes * MILLIS_PER_MINUTE;
    // TESTING only const intervalMillis = timer.intervalMinutes * 10000;
    for (let i = intervalMillis; i < finalTime; i += intervalMillis) {
      console.log('adding interval=' + i);
      intervalTimes.push({ time: i, soundPlayed: false });
    }

    this.setState({
      mainTimerStart: moment(),
      isRunning: true,
      finalTime,
      intervalTimes
    });

    this.interval = setInterval(() => {
      const elapsedTime = moment() - this.state.mainTimerStart + mainTimer;
      const remainingTime = finalTime - elapsedTime;
      this.setState({
        mainTimer: elapsedTime,
        remainingTimer: remainingTime
      });

      if (remainingTime < 0) {
        this.handleEndTimer();
      }
    }, 30);
  }

  handleReset() {
    console.log('reset timer');
    if (this.state.isRunning) {
      this.handleStartStop();
    }
    this.setState(DEFAULT_STATE);
  }

  formatTime(milliseconds) {
    if (!milliseconds) {
      return '00:00.0';
    }
    return moment(milliseconds).format('mm:ss.S');
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

  renderIntervals() {
    if (!this.state.intervalTimes) {
      return null;
    }

    const expiredTimers = [];

    const intervalTimerDisplay = this.state.intervalTimes.map(
      (timer, index) => {
        const intervalTime = timer.time - this.state.mainTimer;

        if (intervalTime > 0) {
          return (
            <Text key={`interval${index}`} style={styles.intervalTimer}>
              {this.formatTime(intervalTime)}
            </Text>
          );
        }

        if (!timer.soundPlayed) {
          this.intervalSound();
          timer.soundPlayed = true;
        }

        expiredTimers.push(
          <Text key={`interval${index}`} style={styles.intervalTimerElapsed}>
            {this.formatTime(timer.time)}
          </Text>
        );

        return null;
      }
    );

    return (
      <View style={styles.timerWrapper}>
        {intervalTimerDisplay}
        {expiredTimers}
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
        onRequestClose={() => console.log('close timer modal')}
      >
        <View style={styles.top}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{timer.title}</Text>
            <Avatar
              small
              rounded
              icon={{ name: 'close' }}
              onPress={this.handleClose.bind(this)}
              activeOpacity={0.7}
              containerStyle={styles.closeButton}
            />
          </View>
          {this.renderTimers()}
        </View>
        <View style={styles.bottom}>
          {this.renderButtons()}
          {this.renderIntervals()}
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
    alignSelf: 'center',
    flexWrap: 'wrap'
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
    fontSize: 30,
    alignSelf: 'center',
    padding: 5
  },
  intervalTimerElapsed: {
    fontSize: 20,
    color: '#bbb',
    alignSelf: 'center',
    padding: 5
  },
  top: {
    flex: 2
  },
  bottom: {
    borderTopWidth: 0.5,
    flex: 3,
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
    marginRight: 20
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { stopSelectedTimer })(RunTimer);
