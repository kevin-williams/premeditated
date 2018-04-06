import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';

import SoundPicker from '../../components/SoundPicker';
import TimeEntryEditor from '../../components/TimeEntryEditor';
import AddNewInterval from '../../components/AddNewInterval';

import { backgroundSounds } from '../../../assets/sound/background/background_sounds';
import { sounds } from '../../../assets/sound/sounds';

import * as c from './timerConstants';
import { addTimer, updateTimer, closeAddDialog } from './timerActions';

import { SCREEN_WIDTH, getTimerDescription } from '../../utils';

const NEW_TIMER = {
  title: '',
  test: true,
  duration: {
    hours: 0,
    mins: 15,
    sound: sounds[0]
  },
  intervals: [],
  backgroundSound: backgroundSounds[0]
};

class AddEditTimer extends Component {
  state = {
    ...NEW_TIMER
  };

  componentDidMount() {
    if (this.props.timer.showAddEditDialog === c.EDIT_MODE) {
      const selectedTimer = this.props.timer.timers.filter(
        timer => timer.id === this.props.timer.selectedTimerId
      );
      if (selectedTimer) {
        this.setState({ ...selectedTimer[0] });
      }
    }
  }

  saveTimer() {
    if (this.props.timer.showAddEditDialog === c.EDIT_MODE) {
      console.log('saving timer', this.state);
      this.props.updateTimer(this.state);
    } else {
      console.log('adding timer', this.state);
      this.props.addTimer(this.state);
    }
    this.props.closeAddDialog();
  }

  addIntervalsToState(intervals) {
    let newIntervals = [];
    newIntervals = newIntervals.concat(this.state.intervals);
    newIntervals = newIntervals.concat(intervals);
    console.log('adding new intervals', newIntervals);
    this.setState({ intervals: newIntervals });
  }

  renderIntervalSelects(hideButton) {
    const { intervals } = this.state;
    console.log('intervals=', intervals);

    const intervalRender = intervals.map((interval, index) => (
      <TimeEntryEditor
        key={`interval-${index}`}
        timeEntry={interval}
        containerStyle={{ borderBottomWidth: 0.5 }}
        onTimeChange={time => {
          const newState = { ...this.state };
          const myInterval = newState.intervals[index];
          myInterval.hours = time.hours;
          myInterval.mins = time.minutes;
          this.setState(newState);
        }}
        onSoundChange={sound => {
          const newIntervals = [].concat(this.state.intervals);
          const myInterval = this.state.intervals[index];
          myInterval.sound = sound;

          this.setState({ intervals: newIntervals });
        }}
      />
    ));

    let addButton = (
      <Avatar
        small
        rounded
        icon={{ name: 'add' }}
        onPress={() => this.setState({ addInterval: true })}
        activeOpacity={0.7}
        containerStyle={styles.addButton}
      />
    );

    if (hideButton) {
      addButton = null;
    }

    return (
      <View style={styles.timeSelect}>
        <View style={styles.intervalHeader}>
          <Text>Intervals</Text>
          {addButton}
        </View>
        <ScrollView style={styles.intervalList}>
          {intervalRender}
        </ScrollView>
      </View>
    );
  }

  renderAddInterval() {
    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Add/Edit Intervals for {getTimerDescription(this.state.duration)}
          </Text>
        </View>
        <AddNewInterval
          timer={this.state}
          onChange={this.addIntervalsToState.bind(this)}
        />
        <ScrollView style={styles.intervalList}>
          {this.renderIntervalSelects(true)}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Avatar
            medium
            rounded
            icon={{ name: 'check' }}
            onPress={() => this.setState({ addInterval: false })}
            activeOpacity={0.7}
            containerStyle={styles.saveButton}
          />
        </View>
      </ImageBackground>
    );
  }

  render() {
    const { duration } = this.state;
    console.log('duration=', duration);

    if (this.state.addInterval) {
      return this.renderAddInterval();
    }

    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Add/Edit Timer</Text>
          <Avatar
            small
            rounded
            icon={{ name: 'close' }}
            onPress={() => this.props.closeAddDialog()}
            activeOpacity={0.7}
            containerStyle={styles.closeButtonTop}
          />
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholderTextColor="grey"
              onChangeText={text => this.setState({ title: text })}
              placeholder="timer name (optional)"
              underlineColorAndroid="transparent"
              value={this.state.title}
            />
          </View>

          <TimeEntryEditor
            label="Duration"
            timeEntry={duration}
            containerStyle={styles.timeSelect}
            onTimeChange={time => {
              this.setState({
                duration: {
                  ...this.state.duration,
                  hours: time.hours,
                  mins: time.minutes
                }
              });
            }}
            onSoundChange={sound => {
              this.setState({
                duration: {
                  ...this.state.duration,
                  sound
                }
              });
            }}
          />
          <View style={styles.timeSelect}>
            <SoundPicker
              label="Background Sound"
              selectedSound={this.state.backgroundSound}
              sounds={backgroundSounds}
              onChange={newSound => {
                console.log('background sound changed', newSound);
                this.setState({ backgroundSound: newSound });
              }}
            />
          </View>

          {this.renderIntervalSelects()}
        </View>
        <View style={styles.buttonContainer}>
          <Avatar
            medium
            rounded
            icon={{ name: 'check' }}
            onPress={this.saveTimer.bind(this)}
            activeOpacity={0.7}
            containerStyle={styles.saveButton}
          />
          <Avatar
            medium
            rounded
            icon={{ name: 'close' }}
            onPress={() => this.props.closeAddDialog()}
            activeOpacity={0.7}
            containerStyle={styles.closeButton}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = {
  backgroundImage: {
    flexDirection: 'column',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1
  },
  timerContainer: {
    width: SCREEN_WIDTH,
    flex: 3,
    marginTop: 5
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    flex: 5
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    borderBottomWidth: 0.5,
    backgroundColor: 'rgba(222,222,222,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    margin: 10
  },
  nameLabel: {
    fontSize: 18,
    textAlign: 'center'
  },
  nameInput: {
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
    width: 200,
    margin: 10
  },
  intervalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intervalList: {
    alignSelf: 'stretch'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    margin: 10
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  },
  closeButtonTop: {
    backgroundColor: 'rgba(180,180,180,.7)',
    margin: 10
  },
  closeButton: {
    backgroundColor: 'rgba(222, 0, 0, 0.6)'
  },
  timeSelect: {
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    padding: 10,
    margin: 10
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {
  addTimer,
  updateTimer,
  closeAddDialog
})(AddEditTimer);
