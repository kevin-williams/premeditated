import React, { Component } from 'react';
import { Text, View } from 'react-native';

import TimeSelect from '../components/TimeSelect';

export default class AddTimer extends Component {
  state = {
    selectedHours: 0,
    selectedMinutes: 0
  };

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    console.log('selectedHours=', selectedHours);
    return (
      <View style={styles.container}>
        <TimeSelect
          hours={selectedHours}
          minutes={selectedMinutes}
          onTimeSelected={time => {
            console.log('change time=', time);
            this.setState({
              selectedHours: time.hours,
              selectedMinutes: time.minutes
            });
          }}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
