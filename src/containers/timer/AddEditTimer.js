import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, Text, TextInput, View } from 'react-native';
import { Avatar } from 'react-native-elements';

import SoundPicker from '../../components/SoundPicker';
import TimeSelect from '../../components/TimeSelect';
import TimeEntryEditor from '../../components/TimeEntryEditor';

import { backgroundSounds } from '../../../assets/sound/background/background_sounds';
import { sounds } from '../../../assets/sound/sounds';

import * as c from './timerConstants';
import { addTimer, updateTimer, closeAddDialog } from './timerActions';

import { SCREEN_WIDTH } from '../../utils';

const NEW_TIMER = {
  title: '',
  test: true,
  duration: {
    hours: 0,
    mins: 15,
    sound: undefined
  },
  intervals: []
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
    if (this.props.timer.showAddEditDialog === c.EDIT_MODE) {
      console.log('saving timer', this.state);
      this.props.updateTimer(this.state);
    } else {
      console.log('adding timer', this.state);
      this.props.addTimer(this.state);
    }
    this.props.closeAddDialog();
  }

  renderIntervalSelects() {
    const { intervals } = this.state;
    console.log('intervals=', intervals);

    const intervalRender = intervals.map((interval, index) => (
      <TimeEntryEditor
        key={`interval-${index}`}
        timeEntry={interval}
        containerStyle={{ borderBottomWidth: 0.5 }}
        onTimeChange={time => {
          const newState = { ...this.state };
          const myInterval = newState.intervals[index];
          myInterval.hours = time.hours;
          myInterval.mins = time.minutes;
          this.setState(newState);
        }}
        onSoundChange={sound => {
          const myInterval = this.state.intervals[index];
          myInterval.sound = sound;
        }}
      />
    ));

    return (
      <View style={styles.timeSelect}>
        <Text>Intervals</Text>
        {intervalRender}
      </View>
    );
  }

  render() {
    const { duration } = this.state;
    console.log('duration=', duration);

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
            <Text style={styles.nameLabel}>Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholderTextColor="grey"
              onChangeText={text => this.setState({ title: text })}
              placeholder="timer name"
              underlineColorAndroid="transparent"
              value={this.state.title}
            />
          </View>

          <TimeEntryEditor
            label="Duration"
            timeEntry={duration}
            containerStyle={styles.timeSelect}
            onTimeChange={time => {
              this.setState({
                duration: {
                  ...this.state.duration,
                  hours: time.hours,
                  mins: time.minutes
                }
              });
            }}
            onSoundChange={sound => {
              this.setState({
                duration: {
                  ...this.state.duration,
                  sound
                }
              });
            }}
          />

          {this.renderIntervalSelects()}

          <View style={styles.timeSelect}>
            <SoundPicker
              label="Background Sound"
              selectedSound={this.state.backgroundSound}
              sounds={backgroundSounds}
              path={'../../../assets/sound/background'}
              onChange={newSound => {
                console.log('background sound changed', newSound);
                this.setState({ backgroundSound: newSound });
              }}
            />
          </View>

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
    marginTop: 5
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    margin: 5
  },
  nameLabel: {
    fontSize: 18,
    textAlign: 'center'
  },
  nameInput: {
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
    width: 200,
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
    padding: 10,
    margin: 10
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {
  addTimer,
  updateTimer,
  closeAddDialog
})(AddEditTimer);
