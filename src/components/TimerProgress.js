import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  Text,
  View
} from 'react-native';

export default class TimerProgress extends Component {
  renderProgressBar() {
    const { startTime, endTime, currentTime } = this.props;
    let progress = 0;

    if (endTime - startTime > 0) {
      progress = currentTime / (endTime - startTime);
    }

    // console.log(`progress=${progress}`);

    if (progress > 1) {
      progress = 1;
    }

    if (Platform.OS === 'ios') {
      return <ProgressViewIOS progress={progress} progressViewStyle="bar" />;
    } else {
      return (
        <ProgressBarAndroid
          progress={progress}
          styleAttr="Horizontal"
          indeterminate={false}
        />
      );
    }
  }

  render() {
    return (
      <View>
        <Text>{this.props.label}</Text>
        {this.renderProgressBar()}
      </View>
    );
  }
}

TimerProgress.defaultProps = {
  startTime: 0
};

TimerProgress.propTypes = {
  label: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
  startTime: PropTypes.number,
  endTime: PropTypes.number.isRequired
};
