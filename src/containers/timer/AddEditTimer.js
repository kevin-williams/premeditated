import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements';

import SoundPicker from '../../components/SoundPicker';
import TimeSelect from '../../components/TimeSelect';

import backgroundSoundFiles from '../../../assets/sound/background/background_sounds.json';
import soundFiles from '../../../assets/sound/sounds.json';

import * as c from './timerConstants';
import { addTimer, updateTimer, closeAddDialog } from './timerActions';

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

  componentDidMount() {
    if (this.props.timer.showAddEditDialog === c.EDIT_MODE) {
      const selectedTimer = this.props.timer.timers.filter(timer => timer.id === this.props.timer.selectedTimerId);
      if (selectedTimer) {
        this.setState({ ...selectedTimer[0] })
      }
    };
  }

  saveTimer() {
    if (this.props.timer.showAddEditDialog == c.EDIT_MODE) {
      console.log('saving timer', this.state);
      this.props.updateTimer(this.state);
    } else {
      console.log('addng timer', this.state);
      this.props.addTimer(this.state);
    }
    this.props.closeAddDialog();
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
            onPress={() => this.props.closeAddDialog()}
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
          <SoundPicker label="End Sound" selectedSound={this.state.endSound} sounds={soundFiles.sounds} path={'../../../assets/sound'} onChange={(newSound) => {
            console.log('end sound changed', newSound); this.setState({ endSound: newSound })
          }} />

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
          <SoundPicker label="Interval Sound" selectedSound={this.state.intervalSound} sounds={soundFiles.sounds} path={'../../../assets/sound'} onChange={(newSound) => {
            console.log('interval sound changed', newSound); this.setState({ intervalSound: newSound })
          }} />

          <SoundPicker label="Background Sound" selectedSound={this.state.backgroundSound} sounds={backgroundSoundFiles.sounds} path={'../../../assets/sound/background'} onChange={(newSound) => {
            console.log('background sound changed', newSound); this.setState({ backgroundSound: newSound })
          }} />


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
    justifyContent: 'center',
    marginTop: 30
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
export default connect(mapStateToProps, { addTimer, updateTimer, closeAddDialog })(AddEditTimer);
