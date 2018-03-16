import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

import TimeSelect from '../../components/TimeSelect';
import { updateTimer } from './timerActions';

class AddTimer extends Component {
  render() {
    const {
      selectedHours,
      selectedMinutes,
      intervalHours,
      intervalMinutes
    } = this.props.timer.selectedTimer;

    return (
      <View style={styles.container}>
        <TimeSelect
          label="Duration"
          hours={selectedHours}
          minutes={selectedMinutes}
          onTimeSelected={time => {
            console.log('change time=', time);
            this.props.updateTimer({
              ...this.props.timer.selectedTimer,
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
            this.props.updateTimer({
              ...this.props.timer.selectedTimer,
              intervalHours: time.hours,
              intervalMinutes: time.minutes
            });
          }}
        />

        <Button
          large
          title="Start"
          onPress={this.startTimer.bind(this)}
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
export default connect(mapStateToProps, { updateTimer })(AddTimer);
