import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';

import RunTimer from './RunTimer';

import { selectTimer, startSelectedTimer } from './timerActions';

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
        <View>
          <Text style={styles.descriptionStyle}>
            Interval every {this.props.myTimer.intervalMinutes} mins
          </Text>
          <Button
            large
            title="Start"
            onPress={this.props.startSelectedTimer}
            backgroundColor="green"
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
          <Card title={timer.title}>
            <Text style={styles.titleStyle}>
              {timer.selectedHours} hr(s) {timer.selectedMinutes} mins
            </Text>
            {this.renderDescription()}
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15
  },
  descriptionStyle: {
    flex: 1
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, { selectTimer, startSelectedTimer })(
  TimerCard
);
