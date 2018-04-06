import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import SoundPicker from './SoundPicker';
import TimeSelect from './TimeSelect';

import { sounds } from '../../assets/sound/sounds';

export default class TimeEntryEditor extends Component {
  renderTimeEntryName() {
    if (this.props.timer && this.props.timer.name) {
      return (
        <TextInput
          style={styles.nameInput}
          placeholderTextColor="grey"
          onChangeText={text => this.props.onNameChange(text)}
          placeholder="Interval name"
          underlineColorAndroid="transparent"
          value={this.props.timer.name}
        />
      );
    }
  }

  render() {
    return (
      <View style={[styles.rowStyle, this.props.containerStyle]}>
        {this.renderTimeEntryName()}
        <TimeSelect
          label={this.props.label}
          hours={this.props.timeEntry.hours}
          minutes={this.props.timeEntry.mins}
          onTimeSelected={time => {
            console.log('change timeEntry=', time);
            this.props.onTimeChange(time);
          }}
        />
        <SoundPicker
          selectedSound={this.props.timeEntry.sound}
          sounds={sounds}
          onChange={newSound => {
            console.log('interval sound changed', newSound);
            this.props.onSoundChange(newSound);
          }}
        />
      </View>
    );
  }
}

const styles = {
  rowStyle: {
    flexDirection: 'row'
  }
};

TimeEntryEditor.propTypes = {
  label: PropTypes.string,
  timeEntry: PropTypes.object.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onSoundChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func,
  containerStyle: PropTypes.object
};
