import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, Text, TextInput, View } from 'react-native';
import { Avatar } from 'react-native-elements';

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
      const selectedTimer = this.props.timer.timers.filter(
        timer => timer.id === this.props.timer.selectedTimerId
      );
      if (selectedTimer) {
        this.setState({ ...selectedTimer[0] });
      }
    }
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
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Add/Edit Timer</Text>
          <Avatar
            small
            rounded
            icon={{ name: 'close' }}
            onPress={() => this.props.closeAddDialog()}
            activeOpacity={0.7}
            containerStyle={styles.closeButtonTop}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>Timer Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholderTextColor="grey"
              onChangeText={text => this.setState({ title: text })}
              placeholder="timer name"
              underlineColorAndroid="transparent"
              value={this.state.title}
            />
          </View>

          <TimeSelect
            style={styles.timeSelect}
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
          <SoundPicker
            label="End Sound"
            selectedSound={this.state.endSound}
            sounds={soundFiles.sounds}
            path={'../../../assets/sound'}
            onChange={newSound => {
              console.log('end sound changed', newSound);
              this.setState({ endSound: newSound });
            }}
          />

          <TimeSelect
            style={styles.timeSelect}
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
          <SoundPicker
            label="Interval Sound"
            selectedSound={this.state.intervalSound}
            sounds={soundFiles.sounds}
            path={'../../../assets/sound'}
            onChange={newSound => {
              console.log('interval sound changed', newSound);
              this.setState({ intervalSound: newSound });
            }}
          />

          <SoundPicker
            label="Background Sound"
            selectedSound={this.state.backgroundSound}
            sounds={backgroundSoundFiles.sounds}
            path={'../../../assets/sound/background'}
            onChange={newSound => {
              console.log('background sound changed', newSound);
              this.setState({ backgroundSound: newSound });
            }}
          />

          <View style={styles.buttonContainer}>
            <Avatar
              medium
              rounded
              icon={{ name: 'check' }}
              onPress={this.saveTimer.bind(this)}
              activeOpacity={0.7}
              containerStyle={styles.saveButton}
            />
            <Avatar
              medium
              rounded
              icon={{ name: 'close' }}
              onPress={() => this.props.closeAddDialog()}
              activeOpacity={0.7}
              containerStyle={styles.closeButton}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = {
  backgroundImage: {
    flexDirection: 'column',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1
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
  headerContainer: {
    width: SCREEN_WIDTH,
    borderBottomWidth: 0.5,
    backgroundColor: 'rgba(222,222,222,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25
  },
  nameContainer: {
    width: 200,
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    margin: 10
  },
  nameLabel: {
    fontSize: 18,
    textAlign: 'center'
  },
  nameInput: {
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  },
  closeButtonTop: {
    backgroundColor: 'rgba(180,180,180,.7)',
    margin: 10
  },
  closeButton: {
    backgroundColor: 'rgba(222, 0, 0, 0.6)'
  },
  timeSelect: {
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    padding: 10
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {
  addTimer,
  updateTimer,
  closeAddDialog
})(AddEditTimer);
