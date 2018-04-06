import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, Text, TextInput, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import {
  SCREEN_WIDTH,
  getTimerDescription,
  getMillisFromTimer
} from '../utils';

import SoundPicker from './SoundPicker';
import TimeSelect from './TimeSelect';

import { sounds } from '../../assets/sound/sounds';

const IntervalTypes = Object.freeze({
  every: 'every',
  fromStart: 'from start',
  beforeEnd: 'before end',
  fromLast: 'from last'
});

export default class AddNewInterval extends Component {
  state = {
    name: '',
    hours: 0,
    mins: 5,
    mode: IntervalTypes.every,
    sound: sounds[4]
  };

  addIntervals() {
    switch (IntervalTypes[this.state.mode]) {
      case IntervalTypes.every:
        this.addIntervalEvery();
        break;
      case IntervalTypes.beforeEnd:
        this.addIntervalBeforeEnd();
        break;
      case IntervalTypes.fromStart:
        this.addIntervalFromStart();
        break;
      case IntervalTypes.fromLast:
        this.addIntervalFromLast();
        break;
    }
  }

  addIntervalEvery() {
    const finalDurationMillis = getMillisFromTimer(this.props.timer.duration);
    const newIntervals = [];

    let hours = this.state.hours;
    let mins = this.state.mins;

    while (getMillisFromTimer({ hours, mins }) < finalDurationMillis) {
      newIntervals.push({ hours, mins, sound: this.state.sound });
      hours += this.state.hours;
      mins += this.state.mins;

      if (mins >= 60) {
        hours += 1;
        mins -= 60;
      }
    }

    console.log('addIntervalEvery=', newIntervals);
    this.props.onChange(newIntervals);
  }

  addIntervalBeforeEnd() {
    const duration = this.props.timer.duration;
    const hours = duration.hours - this.state.hours;
    const mins = duration.mins - this.state.mins;

    const newIntervals = [{ hours, mins, sound: this.state.sound }];
    console.log('addIntervalBeforeEnd=', newIntervals);
    this.props.onChange(newIntervals);
  }

  addIntervalFromStart() {
    let { name, hours, mins, sound } = this.state;
    if (!name) {
      name = getTimerDescription(this.state);
    }

    const newIntervals = [{ name, hours, mins, sound }];
    console.log('addIntervalFromStart=', newIntervals);
    this.props.onChange(newIntervals);
  }

  addIntervalFromLast() {
    const duration = this.props.timer.duration;

    if (this.props.timer.intervals.length === 0) {
      return this.addIntervalFromStart();
    }

    const maxEntry = this.props.timer.intervals.reduce(
      (prev, current) =>
        getMillisFromTimer(prev) > getMillisFromTimer(current) ? prev : current
    );

    let hours = maxEntry.hours + this.state.hours;
    let mins = maxEntry.mins + this.state.mins;

    if (mins > 60) {
      hours += 1;
      mins -= 60;
    }

    const newInterval = { hours, mins, sound: this.state.sound };

    if (getMillisFromTimer(newInterval) < getMillisFromTimer(duration)) {
      const newIntervals = [newInterval];
      console.log('addIntervalFromLast=', newIntervals);
      this.props.onChange(newIntervals);
    } else {
      // TODO Show error?
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Interval</Text>
        <TextInput
          style={styles.nameInput}
          placeholderTextColor="grey"
          onChangeText={text => this.setState({ name: text })}
          placeholder="interval name (optional)"
          underlineColorAndroid="transparent"
          value={this.state.name}
        />

        <View style={styles.timerContainer}>
          <TimeSelect
            hours={this.state.hours}
            minutes={this.state.mins}
            onTimeSelected={time => {
              console.log('change interval timeEntry=', time);
              this.setState({ hours: time.hours, mins: time.minutes });
            }}
          />
          <Picker
            style={styles.modePicker}
            selectedValue={this.state.mode}
            onValueChange={type => this.setState({ mode: type })}
          >
            {Object.keys(IntervalTypes).map((type, index) => (
              <Picker.Item
                key={`inttype-${index}`}
                label={IntervalTypes[type]}
                value={type}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.bottomContainer}>
          <SoundPicker
            selectedSound={this.state.sound}
            sounds={sounds}
            onChange={sound => {
              console.log('interval sound changed', sound);
              this.setState({ sound });
            }}
          />
          <Avatar
            medium
            rounded
            icon={{ name: 'play-for-work' }}
            onPress={this.addIntervals.bind(this)}
            activeOpacity={0.7}
            containerStyle={styles.saveButton}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(222,222,222,0.7)',
    // backgroundColor: 'rgba(137,234,255,0.8)',
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.9,
    marginTop: 10
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center'
  },
  nameInput: {
    alignSelf: 'center',
    backgroundColor: 'rgba(222,222,222,0.7)',
    // backgroundColor: 'rgba(137,234,255,1)',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
    width: 200,
    margin: 10
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5
  },
  modePicker: {
    width: 150
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  }
};

AddNewInterval.propTypes = {
  timer: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
