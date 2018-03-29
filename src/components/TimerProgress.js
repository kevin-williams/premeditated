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
    const { endTime, currentTime } = this.props;
    let progress = 0;

    if (endTime > 0) {
      progress = currentTime / endTime;
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
        <Text style={this.props.textStyle}>{this.props.label}</Text>
        {this.renderProgressBar()}
      </View>
    );
  }
}

TimerProgress.defaultProps = {
  startTime: 0,
  textStyle: {
    fontSize: 18
  }
};

TimerProgress.propTypes = {
  label: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  textStyle: PropTypes.object
};
