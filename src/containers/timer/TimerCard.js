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

import { selectTimer } from './timerActions';

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
    if (this.props.myTimer.id === this.props.timer.selectedTimer.id) {
      return (
        <View>
          <Text style={styles.descriptionStyle}>
            Interval every {this.props.myTimer.intervalMinutes} mins
          </Text>
          <Button
            large
            title="Start"
            onPress={console.log('start timer now')}
            backgroundColor="green"
          />
        </View>
      );
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

export default connect(mapStateToProps, { selectTimer })(TimerCard);
