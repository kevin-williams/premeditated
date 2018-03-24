import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayoutAnimation, Modal, UIManager, Text, View } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { AdMobBanner } from 'expo';

import TimerListSubtitle from './TimerListSubtitle';
import AddEditTimer from './AddEditTimer';
import RunTimer from './RunTimer';

import { loadApp, selectTimer, showAddDialog, closeAddDialog } from './timerActions';

import { AD_MOB_ID, SCREEN_WIDTH } from '../../utils';

import * as c from './timerConstants';

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
        containerStyle={{ width: SCREEN_WIDTH }}
        leftIcon={{ name: 'av-timer' }}
        key={`timer_item_${index}`}
        title={timer.title}
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

    if (this.props.timer.showAddEditDialog === c.ADD_MODE || this.props.timer.showAddEditDialog === c.EDIT_MODE) {
      return <AddEditTimer />;
    }

    // TODO make title fancier
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainerStyle}>
          <Text style={styles.title}>Premeditated</Text>
          <Avatar
            small
            rounded
            icon={{ name: 'add' }}
            onPress={() => this.props.showAddDialog(c.ADD_MODE)}
            activeOpacity={0.7}
            containerStyle={styles.buttonStyle}
          />
        </View>
        <List style={styles.list}>{this.renderListItems()}</List>
        <AdMobBanner
          style={{ width: SCREEN_WIDTH, flex: 1 }}
          adUnitID={AD_MOB_ID}
          testDeviceID="EMULATOR"
          didFailToReceiveAdWithError={this.bannerError}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    width: SCREEN_WIDTH
  },
  buttonStyle: {
    marginRight: 20,
    marginTop: 30
  }, title: {
    marginTop: 30,
    fontSize: 24,
    textAlign: 'center',
    flex: 1
  },
  list: {
    flex: 1
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { loadApp, selectTimer, showAddDialog, closeAddDialog })(TimerList);
