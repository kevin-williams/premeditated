import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  Text,
  View
} from 'react-native';

import { Icon } from 'react-native-elements';
import { ICONS } from '../utils';

export default class TimerProgress extends Component {
  renderProgressBar(progress) {
    // console.log(`progress=${progress}`);

    if (progress > 1) {
      return null;
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
    const { endTime, currentTime } = this.props;
    let progress = 0;

    if (endTime > 0) {
      progress = currentTime / endTime;
    }

    const formatStyle =
      progress > 1 ? styles.completedTextStyle : styles.runningTextStyle;

    const checkMark =
      progress > 1 ? (
        <Icon
          name={ICONS.Check.name}
          color="green"
          containerStyle={{ backgroundColor: 'lightgrey', borderRadius: 10 }}
        />
      ) : null;

    let label = (
      <View style={styles.label}>
        {checkMark}
        <Text style={[this.props.textStyle, formatStyle]}>
          {this.props.label}
        </Text>
      </View>
    );

    if (!this.props.label) {
      label = null;
    }

    return (
      <View>
        {label}
        {this.renderProgressBar(progress)}
      </View>
    );
  }
}

const styles = {
  label: {
    flexDirection: 'row'
  },
  runningTextStyle: {
    color: 'black',
    paddingLeft: 10,
    backgroundColor: 'rgba(222,222,222,0.9)',
    borderRadius: 10,
    width: '100%'
  },
  completedTextStyle: {
    color: 'black',
    paddingLeft: 10
  }
};

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
