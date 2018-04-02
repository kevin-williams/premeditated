import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  ImageBackground,
  LayoutAnimation,
  PanResponder,
  UIManager,
  Text,
  View
} from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { AdMobBanner } from 'expo';

import TimerListSubtitle from './TimerListSubtitle';
import AddEditTimer from './AddEditTimer';
import RunTimer from './RunTimer';

import {
  loadApp,
  deleteTimer,
  selectTimer,
  startSelectedTimer,
  showAddDialog,
  closeAddDialog
} from './timerActions';

import { AD_MOB_ID, SCREEN_WIDTH, getTimerDescription } from '../../utils';

import * as c from './timerConstants';

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;
const SWIPE_OUT_DURATION = 250;

const CustomLayoutLinear = {
  duration: 100,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.linear
  },
  delete: {
    duration: 50,
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  }
};

class TimerList extends Component {
  constructor(props) {
    super(props);
    this.props.loadApp();

    this.position = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // console.log('gesture=', gesture);
        this.position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (event, gesture) => {
        // console.log('release=', gesture);
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('Right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('Left');
        } else {
          this.resetPosition();
        }
      }
    });
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillUpdate() {
    // LayoutAnimation.easeInEaseOut();
    LayoutAnimation.configureNext(CustomLayoutLinear);
  }

  onSwipeComplete(direction) {
    console.log(`Swiped ${direction}`);
    if (direction === 'Right') {
      this.props.startSelectedTimer();
    } else {
      this.props.deleteTimer(this.props.timer.selectedTimerId);
    }

    this.position.setValue({ x: 0, y: 0 });
  }

  getSwipeStyle(timer) {
    if (this.props.timer.selectedTimerId !== timer.id) {
      return {};
    }

    return {
      ...this.position.getLayout(),
      transform: [{ translateX: this.position.x }]
    };
  }

  /**
   * Passed the swipe threshold, so now finish the rest of the swipe out
   * @param direction
   */
  forceSwipe(direction) {
    const newX = direction === 'Right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this.position, {
      toValue: { x: newX, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderSubtitle(timer) {
    return <TimerListSubtitle myTimer={timer} />;
  }

  renderListItems() {
    if (!this.props.timer.timers) {
      return null;
    }

    return this.props.timer.timers.map((timer, index) => {
      let listItemStyle = styles.listItem;
      let titleStyle = styles.listItemTitle;
      if (timer.id === this.props.timer.selectedTimerId) {
        listItemStyle = [styles.listItem, styles.listItemSelectedBackground];
        titleStyle = [
          styles.listItemTitle,
          styles.listItemTitleSelectedBackground
        ];
      }

      return (
        <Animated.View
          key={timer.id}
          style={this.getSwipeStyle(timer)}
          {...this.panResponder.panHandlers}
        >
          <ListItem
            containerStyle={listItemStyle}
            avatar={
              <Avatar
                small
                rounded
                icon={{ name: 'av-timer', color: 'white' }}
                containerStyle={{ backgroundColor: 'grey' }}
              />
            }
            badge={{
              value: getTimerDescription(timer),
              textStyle: { color: 'white' },
              containerStyle: {
                width: 110,
                marginTop: -20,
                marginLeft: 10,
                backgroundColor: 'grey'
              }
            }}
            title={timer.title}
            titleStyle={titleStyle}
            onPress={() => this.props.selectTimer(timer)}
            subtitle={this.renderSubtitle(timer)}
          />
        </Animated.View>
      );
    });
  }

  render() {
    if (
      this.props.timer.runningTimer &&
      this.props.timer.runningTimer.isRunning
    ) {
      return <RunTimer />;
    }

    if (
      this.props.timer.showAddEditDialog === c.ADD_MODE ||
      this.props.timer.showAddEditDialog === c.EDIT_MODE
    ) {
      return <AddEditTimer />;
    }

    // TODO make title fancier
    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.buttonContainerStyle}>
            <Text style={styles.title}>Premeditated</Text>
            <Avatar
              small
              rounded
              icon={{ name: 'add' }}
              onPress={() => this.props.showAddDialog(c.ADD_MODE)}
              activeOpacity={0.7}
              containerStyle={styles.addButton}
            />
          </View>
          <List containerStyle={styles.list}>{this.renderListItems()}</List>
          <AdMobBanner
            style={{
              width: SCREEN_WIDTH,
              height: 50,
              marginBottom: 50,
              alignSelf: 'flex-end'
            }}
            adUnitID={AD_MOB_ID}
            testDeviceID="EMULATOR"
            didFailToReceiveAdWithError={error =>
              console.log('error loading ad banner', error)
            }
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = {
  backgroundImage: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  container: {
    backgroundColor: 'rgba(222,222,222,0.2)'
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    width: SCREEN_WIDTH
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'rgba(222,222,222,0.7)',
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1
  },
  addButton: {
    backgroundColor: 'white',
    marginRight: 20,
    marginTop: 30
  },
  list: {
    backgroundColor: 'transparent',
    flex: 1
  },
  listItem: {
    backgroundColor: 'rgba(222,222,222,0.4)',
    width: SCREEN_WIDTH
  },
  listItemSelectedBackground: {
    backgroundColor: 'rgba(222,222,222,0.9)'
  },
  listItemTitle: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'rgba(222,222,222,0.7)',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10
  },
  listItemTitleSelectedBackground: {
    backgroundColor: 'transparent'
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {
  loadApp,
  deleteTimer,
  selectTimer,
  startSelectedTimer,
  showAddDialog,
  closeAddDialog
})(TimerList);
