import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

import * as c from './timerConstants';
import {
  deleteTimer,
  selectTimer,
  startSelectedTimer,
  showAddDialog
} from './timerActions';

class TimerListSubtitle extends Component {
  getTimerDescription(timer) {
    let hourStr = '';
    if (timer.selectedHours === 1) {
      hourStr = `${timer.selectedHours} hr `;
    } else if (timer.selectedHours > 1) {
      hourStr = `${timer.selectedHours} hrs `;
    }

    let minuteStr = '';
    if (timer.selectedMinutes === 1) {
      minuteStr = `${timer.selectedMinutes} min `;
    } else if (timer.selectedMinutes > 1) {
      minuteStr = `${timer.selectedMinutes} mins `;
    }

    return hourStr + minuteStr;
  }

  render() {
    const timer = this.props.myTimer;

    if (timer.id !== this.props.timer.selectedTimerId) {
      return (
        <View>
          <Text style={styles.subtitleText}>
            {this.getTimerDescription(timer)}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          {this.getTimerDescription(timer)}
        </Text>
        <Avatar
          medium
          rounded
          icon={{ name: 'play-arrow' }}
          onPress={this.props.startSelectedTimer}
          overlayContainerStyle={styles.start}
        />
        <Avatar
          small
          rounded
          icon={{ name: 'edit' }}
          onPress={() => this.props.showAddDialog(c.EDIT_MODE)}
          activeOpacity={0.7}
          overlaycontainerStyle={styles.button}
        />
        <Avatar
          small
          rounded
          icon={{ name: 'delete-forever' }}
          onPress={() => this.props.deleteTimer(timer.id)}
          activeOpacity={0.7}
          overlaycontainerStyle={styles.button}
        />
      </View>
    );
  }
}

const styles = {
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subtitleText: {
    marginLeft: 20,
    fontSize: 14,
    color: 'black'
  },
  button: {
    backgroundColor: 'white'
  },
  start: {
    alignSelf: 'center',
    backgroundColor: 'green'
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  deleteTimer,
  selectTimer,
  showAddDialog,
  startSelectedTimer
})(TimerListSubtitle);
