import React, { Component } from 'react';
import {
  DatePickerIOS,
  Modal,
  Picker,
  Platform,
  Text,
  TimePickerAndroid,
  View
} from 'react-native';
import moment from 'moment';

import { Avatar } from 'react-native-elements';
import { getTimerDescription, SCREEN_WIDTH } from '../utils';

const hourPickerItems = [];
const minutePickerItems = [];

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

  renderPickerHours = () => {
    if (hourPickerItems.length === 0) {
      for (let i = 0; i <= 2; i++) {
        hourPickerItems.push(
          <Picker.Item key={`HourItem${i}`} label={`${i}`} value={i} />
        );
      }
    }
    return hourPickerItems;
  };

  renderPickerMinutes = () => {
    if (minutePickerItems.length === 0) {
      for (let i = 0; i <= 59; i++) {
        minutePickerItems.push(
          <Picker.Item key={`MinuteItem${i}`} label={`${i}`} value={i} />
        );
      }
    }
    return minutePickerItems;
  };

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

      // console.log(`selected ${selectedHours}:${selectedMinutes} for ${action}`);

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
    const { hours, minutes } = this.props;
    return (
      <View style={styles.iosPickerView}>
        <Text style={styles.label}>Hours</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={hours}
          prompt="Hours"
          onValueChange={itemValue =>
            this.props.onTimeSelected({ hours: itemValue, minutes })
          }
        >
          {this.renderPickerHours()}
        </Picker>

        <Text style={styles.label}>Minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={minutes}
          prompt="Minutes"
          onValueChange={itemValue =>
            this.props.onTimeSelected({ hours, minutes: itemValue })
          }
        >
          {this.renderPickerMinutes()}
        </Picker>
        <Avatar
          medium
          rounded
          icon={{ name: 'check' }}
          onPress={() => this.setState({ showModal: false })}
          activeOpacity={0.7}
          containerStyle={styles.saveButton}
        />
      </View>
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
          containerStyle={styles.buttonContainer}
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
  iosPickerView: {
    flexDirection: 'column',
    width: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
    paddingTop: 20
  },
  picker: {
    width: 300,
    height: 150
  },
  pickerItem: {
    height: 150
  },
  button: {
    backgroundColor: 'white',
    alignSelf: 'center'
  },
  buttonContainer: {
    margin: 5,
    alignSelf: 'center'
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)',
    marginTop: 20
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
