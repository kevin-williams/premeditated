import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ImageBackground,
  Modal,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { Audio } from 'expo';
import moment from 'moment';

import { stopSelectedTimer } from './timerActions';

import { SCREEN_WIDTH } from '../../utils';

// const MILLIS_PER_MINUTE = 60000;
const MILLIS_PER_MINUTE = 10000;
const MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;

const bellSound = require('../../../assets/sound/gong.mp3');
const tingSound = require('../../../assets/sound/ting.mp3');
const riverSound = require('../../../assets/sound/background/River.mp3');

const endSound = new Audio.Sound();
const intervalSound = new Audio.Sound();
const backgroundSound = new Audio.Sound();

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

    backgroundSound
      .loadAsync(riverSound)
      .then(console.log('sound loaded'))
      .catch(console.log('sound already loaded'));
  }

  state = DEFAULT_STATE;

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
    });
  }

  componentWillUnmount() {
    if (this.state.isRunning) {
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    }
  }

  endSound() {
    backgroundSound.stopAsync().then(() => {
      console.log('Play end sound');
      endSound.replayAsync();
    });
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
      backgroundSound.stopAsync();
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
    if (intervalMillis > 0) {
      for (let i = intervalMillis; i < finalTime; i += intervalMillis) {
        console.log('adding interval=' + i);
        intervalTimes.push({ time: i, soundPlayed: false });
      }
    }

    this.setState({
      mainTimerStart: moment(),
      isRunning: true,
      finalTime,
      intervalTimes
    });

    backgroundSound.setIsLoopingAsync(true);
    backgroundSound.replayAsync();

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
        animationType="slide"
        tranparent={false}
        visible
        onRequestClose={() => console.log('close timer modal')}
      >
        <ImageBackground
          resizeMode="cover"
          source={this.props.timer.appBackground}
          style={styles.backgroundImage}
        >
          <View style={styles.top}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{timer.title}</Text>
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
        </ImageBackground>
      </Modal>
    );
  }
}

const styles = {
  backgroundImage: {
    width: SCREEN_WIDTH,
    flexDirection: 'column',
    flex: 1,
    alignContent: 'stretch',
    justifyContent: 'center'
  },

  headerText: {
    fontSize: 24,
    backgroundColor: 'transparent',
    textAlign: 'center',
    flex: 1
  },
  headerContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  timerContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  timerWrapper: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    flexWrap: 'wrap'
  },
  mainTimer: {
    backgroundColor: 'transparent',
    fontSize: 60,
    fontWeight: '100',
    alignSelf: 'flex-end',
    padding: 5
  },
  remainingTimer: {
    backgroundColor: 'transparent',
    fontSize: 40,
    alignSelf: 'flex-end',
    padding: 5
  },
  intervalTimer: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    borderRadius: 10,
    fontSize: 25,
    alignSelf: 'center',
    padding: 5,
    margin: 5
  },
  intervalTimerElapsed: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    fontSize: 18,
    color: '#bbb',
    alignSelf: 'center',
    padding: 5,
    margin: 5
  },
  top: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    flex: 2
  },
  bottom: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    borderTopWidth: 0.5,
    flex: 3,
    marginBottom: 30
  },
  buttonWrapper: {
    backgroundColor: 'transparent',
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
    backgroundColor: 'white',
    marginRight: 20
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { stopSelectedTimer })(RunTimer);
