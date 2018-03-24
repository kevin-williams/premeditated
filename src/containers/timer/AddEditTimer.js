import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements';

import TimeSelect from '../../components/TimeSelect';

import { addTimer, updateTimer } from './timerActions';

import { SCREEN_WIDTH } from '../../utils';

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

  componentWillMount() {
    if (this.props.editTimer) {
      const selectedTimer = this.props.timer.timers.filter(timer => timer.id === this.props.editTimer);
      if (selectedTimer) {
        this.setState({ ...selectedTimer[0] })
      }
    };
  }

  saveTimer() {
    if (this.props.editTimer) {
      console.log('saving timer', this.state);
      this.props.updateTimer(this.state);
    } else {
      console.log('addng timer', this.state);
      this.props.addTimer(this.state);
    }
    this.props.closeModal();
  }

  handleClose() {
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
        <View style={styles.closeContainer}>
          <Text style={styles.headerText}>Add/Edit Timer</Text>
          <TouchableHighlight
            style={styles.closeButton}
            underlayColor="#777"
            onPress={this.handleClose.bind(this)}
          >
            <Text style={{ fontSize: 18 }}>X</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.bottom}>
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
  },
  bottom: {
    flex: 3,
    marginTop: 20
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    flex: 5
  },
  closeContainer: {
    width: SCREEN_WIDTH,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  closeButton: {
    width: 40,
    height: 40,
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { addTimer, updateTimer })(AddEditTimer);
