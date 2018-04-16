import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Link } from 'react-router-native';

import * as c from './timerConstants';
import { deleteTimer, startSelectedTimer } from './timerActions';

class TimerListSubtitle extends Component {
  render() {
    const timer = this.props.myTimer;

    if (timer.id !== this.props.timer.selectedTimerId) {
      return null;
    }

    return (
      <View style={styles.subtitleContainer}>
        <Link
          to={{
            pathname: '/AddEditTimer',
            state: { timer }
          }}
        >
          <Avatar small rounded icon={{ name: 'edit' }} activeOpacity={0.7} />
        </Link>
        <Link
          to={{
            pathname: '/RunTimer',
            state: { timer }
          }}
        >
          <Avatar
            small
            rounded
            icon={{ name: 'play-arrow' }}
            overlayContainerStyle={styles.start}
          />
        </Link>
        <Avatar
          small
          rounded
          icon={{ name: 'delete-forever' }}
          onPress={() => this.props.deleteTimer(timer.id)}
          activeOpacity={0.7}
          overlayContainerStyle={styles.delete}
        />
      </View>
    );
  }
}

const styles = {
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  subtitleText: {
    marginLeft: 20,
    fontSize: 14,
    color: 'black'
  },
  delete: {
    backgroundColor: 'rgba(180,0,0,.7)'
  },
  start: {
    alignSelf: 'center',
    backgroundColor: 'green'
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  deleteTimer,
  startSelectedTimer
})(TimerListSubtitle);
