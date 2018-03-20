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
      this.props.myTimer.id === this.props.timer.selectedTimerId
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

      if (
        this.props.timer.runningTimer &&
        this.props.timer.runningTimer.isRunning
      ) {
        render = <RunTimer />;
      }

      return render;
    }
  }

  render() {
    const timer = this.props.myTimer;

    let cardStyle = styles.card;
    let cardHeaderStyle = styles.cardHeader;
    if (timer.id === this.props.timer.selectedTimerId) {
      cardStyle = styles.selectedCard;
      cardHeaderStyle = [styles.cardHeader, styles.cardHeaderSelected];
    }

    return (
      <TouchableWithoutFeedback onPress={() => this.props.selectTimer(timer)}>
        <Card containerStyle={cardStyle}>
          <View style={cardHeaderStyle}>
            <Text style={styles.titleStyle}>{timer.title}</Text>
            <Avatar
              small
              rounded
              title="-"
              onPress={() => this.props.deleteTimer(timer.id)}
              activeOpacity={0.7}
              containerStyle={styles.delete}
            />
          </View>
          {this.renderDescription()}
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  selectedCard: {
    backgroundColor: 'white',
    marginLeft: 20,
    borderRadius: 15
  },
  cardHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    flex: 1
  },
  cardHeaderSelected: {
    borderBottomWidth: 0.5
  },
  card: {
    backgroundColor: '#e5e5e5',
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 15
  },
  delete: {
    alignSelf: 'flex-end'
  },
  start: {
    alignSelf: 'center',
    backgroundColor: 'green'
  },
  titleStyle: {
    fontSize: 22,
    paddingLeft: 15,
    textAlign: 'center',
    flex: 2
  },
  timerDescStyle: {
    fontSize: 16,
    paddingLeft: 15,
    textAlign: 'center'
  },
  descriptionStyle: {
    textAlign: 'center'
  },
  descriptionContainer: {
    alignItems: 'center'
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  deleteTimer,
  selectTimer,
  startSelectedTimer
})(TimerCard);
