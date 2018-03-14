import React, { Component } from 'react';
import { Picker, Text, View } from 'react-native';

const hourPickerItems = [];
const minutePickerItems = [];

export default class TimeSelect extends Component {
  constructor() {
    super();
    this.loadPickerHours();
    this.loadPickerMinutes();
  }

  loadPickerHours = () => {
    for (let i = 0; i <= 2; i++) {
      hourPickerItems.push(
        <Picker.Item key={`HourItem${i}`} label={`${i}`} value={i} />
      );
    }
  };

  loadPickerMinutes = () => {
    for (let i = 0; i <= 59; i++) {
      minutePickerItems.push(
        <Picker.Item key={`MinuteItem${i}`} label={`${i}`} value={i} />
      );
    }
  };

  render() {
    const { hours, minutes, label, onTimeSelected } = this.props;

    return (
      <View>
        <Text style={styles.labelStyle}>{label}</Text>
        <View style={styles.containerStyle}>
          <Text style={styles.textStyle}>Hours</Text>
          <Text style={styles.textStyle}>Minutes</Text>
        </View>
        <View style={styles.containerStyle}>
          <Picker
            style={{ width: 100, height: 50 }}
            selectedValue={hours}
            prompt="Hours"
            onValueChange={itemValue =>
              onTimeSelected({ hours: itemValue, minutes })
            }
          >
            {hourPickerItems}
          </Picker>

          <Picker
            style={{ width: 100, height: 50 }}
            rr
            selectedValue={minutes}
            prompt="Minutes"
            onValueChange={itemValue =>
              onTimeSelected({ hours, minutes: itemValue })
            }
          >
            {minutePickerItems}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  pickerStyle: {
    width: 100,
    height: 50
  },
  textStyle: {
    textAlign: 'center',
    flex: 1
  },
  labelStyle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  }
};
