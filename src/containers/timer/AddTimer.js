import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

import TimeSelect from '../../components/TimeSelect';

import { addTimer } from './timerActions';

const NEW_TIMER = {
  title: '',
  selectedHours: 0,
  selectedMinutes: 10,
  intervalHours: 0,
  intervalMinutes: 5,
  timerId: undefined,
  intervalId: undefined
};

class AddEditTimer extends Component {
  state = {
    ...NEW_TIMER
  };

  saveTimer() {
    this.props.addTimer(this.state);
    this.props.closeModal();
  }

  render() {
    const {
      selectedHours,
      selectedMinutes,
      intervalHours,
      intervalMinutes
    } = this.state;

    return (
      <View style={styles.container}>
        <Text>Name</Text>
        <TextInput
          style={{ width: 200, height: 40 }}
          onChangeText={text => this.setState({ title: text })}
          placeholder="timer name"
          value={this.state.title}
        />

        <TimeSelect
          label="Duration"
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

        <TimeSelect
          label="Interval"
          hours={intervalHours}
          minutes={intervalMinutes}
          onTimeSelected={time => {
            console.log('change interval=', time);
            this.setState({
              intervalHours: time.hours,
              intervalMinutes: time.minutes
            });
          }}
        />

        <Button
          large
          title="Save"
          onPress={this.saveTimer.bind(this)}
          backgroundColor="green"
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

const mapStateToProps = state => state;
export default connect(mapStateToProps, { addTimer })(AddEditTimer);
