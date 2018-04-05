import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { SCREEN_WIDTH } from '../utils';

import SoundPicker from './SoundPicker';
import TimeSelect from './TimeSelect';

import { sounds } from '../../assets/sound/sounds';

const IntervalTypes = Object.freeze({
  every: 'every',
  fromStart: 'from start',
  beforeEnd: 'before end',
  fromLast: 'from last'
});

export default class AddNewInteravl extends Component {
  state = {
    hours: 0,
    mins: 5,
    mode: IntervalTypes.every,
    sound: sounds[0]
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Interval</Text>
        <View style={styles.timerContainer}>
          <TimeSelect
            hours={this.state.hours}
            minutes={this.state.mins}
            onTimeSelected={time => {
              console.log('change interval timeEntry=', time);
              this.setState({ hours: time.hours, mins: time.miutes });
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
            onPress={() => console.log('do add interval!')}
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
    backgroundColor: 'rgba(137,234,255,0.6)',
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.8,
    marginTop: 10
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center'
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

AddNewInteravl.propTypes = {
  onChange: PropTypes.func.isRequired
};
