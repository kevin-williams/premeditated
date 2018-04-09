import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, Modal, Text, Vibration, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Audio, KeepAwake } from 'expo';
import moment from 'moment';

import { stopSelectedTimer } from './timerActions';
import TimerProgress from '../../components/TimerProgress';

import { SCREEN_WIDTH, getMillisFromTimer } from '../../utils';

const DEFAULT_STATE = {
  isRunning: false,
  mainTimer: 0,
  remainingTimer: 0,
  finalTime: 0,
  intervalTimers: [],
  backgroundSound: undefined
};

class RunTimer extends Component {
  componentWillMount() {
    console.log('runningTimer=', this.props.timer.runningTimer);
    this.setState({ ...DEFAULT_STATE });

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

  async endSound() {
    const { runningTimer } = this.props.timer;
    if (this.state.backgroundSound) {
      try {
        await this.state.backgroundSound.stopAsync();
      } catch (error) {
        console.log('error stopping background sound', error);
      }
      this.setState({ backgroundSound: undefined });
    }

    console.log('Play end sound');
    if (runningTimer.duration.sound.name.startsWith('Vibrate')) {
      // Vibration pattern is stored in the file variable
      console.log('vibrate');
      Vibration.vibrate(runningTimer.duration.sound.file);
    } else {
      try {
        const endSound = new Audio.Sound();
        await endSound.loadAsync(runningTimer.duration.sound.file);
        endSound.replayAsync();
      } catch (error) {
        console.log('error playing end sound', error);
      }
    }
  }

  async intervalSound(sound) {
    console.log('Play interval sound');
    if (sound.name.startsWith('Vibrate')) {
      // Vibration pattern is stored in the file variable
      console.log('vibrate');
      Vibration.vibrate(sound.file);
    } else {
      try {
        const intervalSound = new Audio.Sound();
        await intervalSound.loadAsync(sound.file);
        intervalSound.replayAsync();
      } catch (error) {
        console.log('error loading interval sound', error);
      }
    }
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
    const { isRunning } = this.state;
    this.setState({ isRunning: !isRunning });

    // Stop pressed
    if (isRunning) {
      console.log('stop');
      clearInterval(this.interval);
      this.setState({ isRunning: false });
      if (this.state.backgroundSound) {
        this.state.backgroundSound.stopAsync();
      }
    } else {
      console.log('start');
      this.processStart();
    }
  }

  async processStart() {
    // Start pressed
    const timer = this.props.timer.runningTimer;
    const { mainTimer } = this.state;

    const finalTime = getMillisFromTimer(timer.duration, timer.test);
    const intervalTimes = [];

    timer.intervals.map(interval => {
      intervalTimes.push({
        time: getMillisFromTimer(interval, timer.test),
        sound: interval.sound,
        soundPlayed: false
      });
    });

    this.setState({
      mainTimerStart: moment(),
      isRunning: true,
      finalTime,
      intervalTimes
    });

    if (this.state.backgroundSound) {
      this.state.backgroundSound.playAsync();
    } else if (timer.backgroundSound && timer.backgroundSound.file) {
      try {
        const backgroundSound = new Audio.Sound();
        await backgroundSound.loadAsync(timer.backgroundSound.file);
        backgroundSound.setIsLoopingAsync(true);
        backgroundSound.replayAsync();
        this.setState({ backgroundSound });
      } catch (error) {
        console.log('error loading background sound', error);
      }
    }

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
    this.setState({ ...DEFAULT_STATE });
  }

  formatTime(milliseconds) {
    if (!milliseconds) {
      return '00:00';
    }

    const d = moment.utc(milliseconds);
    const hours = d.hours();

    if (hours > 0) {
      return d.format('h:mm');
    }
    return d.format('mm.ss');
  }

  renderButtons() {
    const stopStyle = this.state.isRunning
      ? styles.stopButton
      : styles.startButton;

    const stopIcon = this.state.isRunning
      ? { name: 'pause-circle-outline' }
      : { name: 'play-arrow' };

    return (
      <View style={styles.buttonWrapper}>
        <Avatar
          medium
          rounded
          icon={stopIcon}
          onPress={this.handleStartStop.bind(this)}
          activeOpacity={0.7}
          overlayContainerStyle={stopStyle}
        />

        <Avatar
          medium
          rounded
          icon={{ name: 'refresh' }}
          onPress={this.handleReset.bind(this)}
          activeOpacity={0.7}
          containerStyle={styles.closeButton}
        />
      </View>
    );
  }

  renderTimers() {
    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerWrapper}>
          <TimerProgress
            currentTime={this.state.mainTimer}
            endTime={this.state.finalTime}
          />
          <Text style={styles.remainingTimer}>
            Remaining {this.formatTime(this.state.remainingTimer)}
          </Text>
        </View>
      </View>
    );
  }

  renderIntervals() {
    if (!this.state.intervalTimes) {
      return null;
    }

    const intervalTimerDisplay = this.state.intervalTimes.map(
      (timer, index) => {
        const timeDifference = this.state.mainTimer - timer.time;

        // console.log(
        //   `timer check:
        //     ${timer.time}
        //     ${this.state.mainTimer}
        //     ${timeDifference}
        //     ${timeDifference > 0}
        //     ${timer.soundPlayed}`
        // );

        if (timeDifference > 0 && !timer.soundPlayed) {
          // console.log('hit timer ' + getTimerDescription(timer));
          this.intervalSound(timer.sound);
          timer.soundPlayed = true;
        }

        const label = timer.name ? timer.name : this.formatTime(timer.time);

        return (
          <TimerProgress
            key={`interval-${index}`}
            label={label}
            currentTime={this.state.mainTimer}
            endTime={timer.time}
          />
        );
      }
    );

    return (
      <View style={styles.timerWrapper}>
        <Text style={styles.intervalText}>Interval Timers</Text>
        {intervalTimerDisplay}
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
          source={this.props.timer.appBackground.uri}
          style={styles.backgroundImage}
        >
          <KeepAwake />
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
            {this.renderButtons()}
          </View>
          <View style={styles.bottom}>{this.renderIntervals()}</View>
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
    backgroundColor: 'rgba(222,222,222,0.7)',
    borderRadius: 20,
    textAlign: 'center',
    flex: 1
  },
  headerContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    paddingTop: 10,
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
    width: 200
  },
  remainingTimer: {
    backgroundColor: 'transparent',
    fontSize: 20,
    alignSelf: 'center',
    padding: 5
  },
  intervalText: {
    fontSize: 20,
    backgroundColor: 'rgba(222,222,222,0.7)',
    borderRadius: 20,
    textAlign: 'center'
  },
  top: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    height: 280
  },
  bottom: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    borderTopWidth: 0.5,
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
    backgroundColor: 'rgba(0, 209, 0, .5)'
  },
  stopButton: {
    backgroundColor: 'rgba(255, 0, 0, .5)'
  },
  closeButton: {
    backgroundColor: 'rgba(180,180,180,.7)',
    marginRight: 10,
    marginLeft: 10
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { stopSelectedTimer })(RunTimer);
