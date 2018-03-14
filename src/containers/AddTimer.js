import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class AddTimer extends Component {
  state = {
    selectedHours: 0,
    selectedMinutes: 0
  };

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          {selectedHours}:{selectedMinutes}
        </Text>
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
