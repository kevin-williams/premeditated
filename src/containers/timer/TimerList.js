import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ImageBackground,
  LayoutAnimation,
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
  selectTimer,
  showAddDialog,
  closeAddDialog
} from './timerActions';

import { AD_MOB_ID, SCREEN_WIDTH } from '../../utils';

import * as c from './timerConstants';

const backgroundImage = require('../../../assets/backgrounds/River.png');

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

  renderSubtitle(timer) {
    return <TimerListSubtitle myTimer={timer} />;
  }

  renderListItems() {
    if (!this.props.timer.timers) {
      return null;
    }

    return this.props.timer.timers.map((timer, index) => (
      <ListItem
        containerStyle={styles.listItem}
        avatar={
          <Avatar
            small
            rounded
            icon={{ name: 'av-timer', color: 'white' }}
            containerStyle={{ backgroundColor: 'grey' }}
          />
        }
        key={`timer_item_${index}`}
        title={timer.title}
        titleStyle={styles.listItemTitle}
        onPress={() => this.props.selectTimer(timer)}
        subtitle={this.renderSubtitle(timer)}
      />
    ));
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
        source={backgroundImage}
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
            style={{ width: SCREEN_WIDTH, flex: 1 }}
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
    justifyContent: 'center'
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
  listItemTitle: {
    fontSize: 18,
    backgroundColor: 'rgba(222,222,222,0.7)',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.5
  },
  rightTitle: {
    fontSize: 14,
    color: 'black'
  },
  rightTitleContainer: {
    marginLeft: 10
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {
  loadApp,
  selectTimer,
  showAddDialog,
  closeAddDialog
})(TimerList);
