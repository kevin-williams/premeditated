import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { connect } from 'react-redux';

import RunTimer from './RunTimer';

import { deleteTimer, selectTimer, startSelectedTimer } from './timerActions';

import { SCREEN_WIDTH } from '../../utils';

class TimerCard extends Component {
  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  renderDescription() {
    if (
      this.props.timer &&
      this.props.timer.selectedTimer &&
      this.props.myTimer.id === this.props.timer.selectedTimer.id
    ) {
      let render = (
        <View style={styles.descriptionContainer}>
          <Text style={styles.timerDescStyle}>
            {this.props.myTimer.selectedHours} hr(s){' '}
            {this.props.myTimer.selectedMinutes} mins
          </Text>
          <Text style={styles.descriptionStyle}>
            Interval every {this.props.myTimer.intervalMinutes} mins
          </Text>
          <Avatar
            medium
            rounded
            title=">"
            onPress={this.props.startSelectedTimer}
            overlayContainerStyle={styles.start}
          />
        </View>
      );

      if (this.props.timer.selectedTimer.isRunning) {
        render = <RunTimer />;
      }

      return render;
    }
  }

  render() {
    const timer = this.props.myTimer;

    return (
      <TouchableWithoutFeedback onPress={() => this.props.selectTimer(timer)}>
        <View>
          <Card>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>{timer.title}</Text>
            </View>
            <Avatar
              small
              rounded
              title="-"
              onPress={() => this.props.deleteTimer(timer.id)}
              activeOpacity={0.7}
              containerStyle={styles.delete}
            />
            {this.renderDescription()}
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  delete: {
    marginRight: 10,
    marginTop: 10
  },
  start: {
    backgroundColor: 'green',
    alignSelf: 'center'
  },
  titleContainer: {
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center'
  },
  titleStyle: {
    fontSize: 22,
    paddingLeft: 15,
    textAlign: 'center'
  },
  timerDescStyle: {
    fontSize: 16,
    paddingLeft: 15,
    textAlign: 'center'
  },
  descriptionStyle: {
    textAlign: 'center',
    flex: 1
  },
  descriptionContainer: {
    display: 'flex',
    alignItems: 'center'
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  deleteTimer,
  selectTimer,
  startSelectedTimer
})(TimerCard);
