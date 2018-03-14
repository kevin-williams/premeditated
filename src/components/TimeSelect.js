import React from 'react';
import { Picker, Text, View } from 'react-native';

export const TimeSelect = ({ hours, minutes, onTimeSelected }) => (
  <View>
    <Text>
      Timer {hours}:{minutes}
    </Text>
    {getPickerHours(hours, minutes, onTimeSelected)}
    {getPickerMinutes(hours, minutes, onTimeSelected)}
  </View>
);

const getPickerHours = (hours, minutes, onTimeSelected) => {
  const items = [];

  for (let i = 0; i <= 2; i++) {
    items.push(<Picker.Item key={`HourItem${i}`} label={`${i}`} value={i} />);
  }

  return (
    <Picker
      selectedValue={hours}
      prompt="Hours"
      onValueChange={itemValue => onTimeSelected({ hours: itemValue, minutes })}
    >
      {items}
    </Picker>
  );
};

const getPickerMinutes = (hours, minutes, onTimeSelected) => {
  const items = [];

  for (let i = 0; i <= 59; i++) {
    items.push(<Picker.Item key={`MinuteItem${i}`} label={`${i}`} value={i} />);
  }

  return (
    <Picker
      selectedValue={minutes}
      prompt="Minutes"
      onValueChange={itemValue => onTimeSelected({ hours, minutes: itemValue })}
    >
      {items}
    </Picker>
  );
};
