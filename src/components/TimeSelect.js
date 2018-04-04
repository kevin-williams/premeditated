import React, { Component } from 'react';
import {
  DatePickerIOS,
  Modal,
  Platform,
  Text,
  TimePickerAndroid,
  View
} from 'react-native';
import moment from 'moment';

import { Avatar } from 'react-native-elements';
import { getTimerDescription } from '../utils';

export default class TimeSelect extends Component {
  state = {
    showModal: false
  };

  showTimeDialog() {
    if (Platform.OS === 'ios') {
      this.setState({ showModal: true });
    } else {
      this.showAndroidPicker();
    }
  }

  async showAndroidPicker() {
    const { hours, minutes } = this.props;

    try {
      const {
        action,
        hour: selectedHours,
        minute: selectedMinutes
      } = await TimePickerAndroid.open({
        hour: hours,
        minute: minutes,
        is24Hour: true,
        mode: 'clock'
      });

      console.log(`selected ${selectedHours}:${selectedMinutes} for ${action}`);

      if (action !== TimePickerAndroid.dismissedAction) {
        this.props.onTimeSelected({
          hours: selectedHours,
          minutes: selectedMinutes
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  }

  renderTimeDialog() {
    if (Platform.OS === 'ios') {
      return this.renderIOSPicker();
    }

    return null;
  }

  renderIOSPicker() {
    return (
      <DatePickerIOS
        onDateChange={date => {
          console.log('date changed', date);
          const m = moment(date);

          this.props.onTimeSelected({
            hours: m.hours(),
            minutes: m.minutes()
          });
        }}
        mode="time"
        minuteInterval="1"
      />
    );
  }

  render() {
    const { hours, minutes, label } = this.props;

    const timeDescription = getTimerDescription({
      hours,
      mins: minutes
    });

    return (
      <View style={[styles.containerStyle, this.props.style]}>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          animationType="slide"
          tranparent
        >
          {this.renderTimeDialog()}
        </Modal>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.time}>{timeDescription}</Text>
        <Avatar
          small
          rounded
          icon={{ name: 'av-timer' }}
          onPress={this.showTimeDialog.bind(this)}
          activeOpacity={0.7}
          overlaycontainerStyle={styles.button}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5
  },
  pickerStyle: {
    width: 100,
    height: Platform.OS === 'ios' ? 200 : 50
  },
  button: {
    backgroundColor: 'white',
    alignSelf: 'flex-end'
  },
  textStyle: {
    textAlign: 'center',
    flex: 1
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10
  },
  time: {
    textAlign: 'center',
    fontSize: 15
  }
};
