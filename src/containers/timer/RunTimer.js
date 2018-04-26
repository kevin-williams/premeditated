import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ImageBackground,
  ScrollView,
  Slider,
  Text,
  Vibration,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { BackButton } from 'react-router-native';
import { Audio, KeepAwake } from 'expo';
import moment from 'moment';

import TimerProgress from '../../components/TimerProgress';

import {
  SCREEN_WIDTH,
  getMillisFromTimer,
  GA,
  getTimerDescription
} from '../../utils';
import { Event, ScreenHit } from 'expo-analytics';

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
    const timer = this.props.location.state.timer;
    console.log('runningTimer=', timer);

    this.setState({
      ...DEFAULT_STATE,
      intervalTimes: this.getIntervalTimes(timer)
    });

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
    });

    GA.hit(new ScreenHit('RunTimer'));
  }

  componentWillUnmount() {
    if (this.state.isRunning) {
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    }
  }

  getIntervalTimes(timer) {
    const intervalTimes = [];

    timer.intervals.map(interval => {
      intervalTimes.push({
        name: interval.name,
        time: getMillisFromTimer(interval, timer.test),
        sound: interval.sound,
        soundPlayed: false
      });
    });

    return intervalTimes;
  }

  async endSound() {
    const timer = this.props.location.state.timer;
    if (this.state.backgroundSound) {
      try {
        await this.state.backgroundSound.stopAsync();
      } catch (error) {
        console.log('error stopping background sound', error);
      }
      this.setState({ backgroundSound: undefined });
    }

    console.log('Play end sound');
    if (timer.duration.sound.name.startsWith('Vibrate')) {
      // Vibration pattern is stored in the file variable
      console.log('vibrate');
      Vibration.vibrate(timer.duration.sound.file);
    } else {
      try {
        const endSound = new Audio.Sound();
        await endSound.loadAsync(timer.duration.sound.file);
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
    const timer = this.props.location.state.timer;
    GA.event(
      new Event(
        'Timer',
        'End',
        getTimerDescription(timer.duration),
        Number(getMillisFromTimer(timer.duration))
      )
    );
    this.endSound();
    this.handleStartStop();
    // TODO Add "snooze" here to add time?
    this.handleReset();
  }

  handleClose() {
    console.log('close');
    if (this.state.isRunning) {
      this.handleStartStop();
    }
    this.props.history.goBack();
  }

  handleStartStop() {
    const { isRunning } = this.state;
    const timer = this.props.location.state.timer;
    this.setState({ isRunning: !isRunning });

    // Stop pressed
    if (isRunning) {
      console.log('stop');
      clearInterval(this.interval);
      if (this.state.backgroundSound) {
        this.state.backgroundSound.stopAsync();
      }
      this.setState({ isRunning: false });

      GA.event(
        new Event(
          'Timer',
          'Pause',
          getTimerDescription(timer.duration),
          Number(getMillisFromTimer(timer.duration))
        )
      );
    } else {
      console.log('start');
      GA.event(
        new Event(
          'Timer',
          'Unpause',
          getTimerDescription(timer.duration),
          Number(getMillisFromTimer(timer.duration))
        )
      );
      this.processStart();
    }
  }

  async processStart() {
    // Start pressed
    const timer = this.props.location.state.timer;
    const { mainTimer } = this.state;

    const finalTime = getMillisFromTimer(timer.duration, timer.test);

    GA.event(
      new Event(
        'Timer',
        'Start',
        getTimerDescription(timer.duration),
        Number(getMillisFromTimer(timer.duration))
      )
    );

    this.setState({
      mainTimerStart: moment(),
      isRunning: true,

      finalTime,
      intervalTimes: this.getIntervalTimes(timer)
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
    const timer = this.props.location.state.timer;

    if (this.state.isRunning) {
      this.handleStartStop();
    }
    GA.event(
      new Event(
        'Timer',
        'Reset',
        getTimerDescription(timer.duration),
        Number(getMillisFromTimer(timer.duration))
      )
    );

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

  onVolumeSliderValueChange(value) {
    if (this.state.backgroundSound != null) {
      this.state.backgroundSound.setVolumeAsync(value);
    }
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
          GA.event(new Event('Timer', 'Interval', timer.name, timer.time));

          this.intervalSound(timer.sound);
          timer.soundPlayed = true;
        }

        const label = timer.name
          ? `${this.formatTime(timer.time)} - ${timer.name}`
          : this.formatTime(timer.time);

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
        <ScrollView>{intervalTimerDisplay}</ScrollView>
      </View>
    );
  }

  render() {
    const timer = this.props.location.state.timer;

    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <BackButton />
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
          <Slider
            style={styles.volumeSlider}
            value={1}
            onValueChange={this.onVolumeSliderValueChange.bind(this)}
          />
        </View>
        <View style={styles.bottom}>{this.renderIntervals()}</View>
      </ImageBackground>
    );
  }
}

const styles = {
  backgroundImage: {
    width: SCREEN_WIDTH,
    flexDirection: 'column',
    flex: 1,
    alignContent: 'stretch',
    justifyContent: 'center',
    marginTop: 25
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
    marginTop: 10,
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
    width: '80%'
  },
  remainingTimer: {
    backgroundColor: 'transparent',
    fontSize: 20,
    alignSelf: 'center',
    padding: 5
  },
  intervalText: {
    fontSize: 20,
    backgroundColor: 'rgba(93,188,212,0.9)',
    borderRadius: 20,
    marginBottom: 5,
    width: '50%',
    textAlign: 'center',
    alignSelf: 'center'
  },
  top: {
    backgroundColor: 'rgba(222,222,222,0.2)',
    height: 230
  },
  bottom: {
    backgroundColor: 'rgba(222,222,222,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    borderTopWidth: 0.5,
    marginBottom: 5
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
export default connect(mapStateToProps)(RunTimer);
