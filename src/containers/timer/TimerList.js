import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  ScrollView,
  Text,
  View
} from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { AdMobBanner } from 'expo';

import AddEditTimer from './AddEditTimer';
import BackgroundSelection from '../../components/BackgroundSelection';
import RunTimer from './RunTimer';
import TimerListSubtitle from './TimerListSubtitle';

import {
  loadApp,
  deleteTimer,
  selectTimer,
  startSelectedTimer,
  showAddDialog,
  closeAddDialog,
  changeBackground
} from './timerActions';

import { AD_MOB_ID, SCREEN_WIDTH, getTimerDescription } from '../../utils';

import * as c from './timerConstants';

const TITLE_IMAGE = require('../../../assets/PremeditatedTitle.png');

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

  state = {
    showSelectBackground: false
  };

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillUpdate() {
    // LayoutAnimation.easeInEaseOut();
    LayoutAnimation.configureNext(CustomLayoutLinear);
  }

  onBackgroundChange(bg) {
    if (bg) {
      this.props.changeBackground(bg);
    }

    this.setState({ showSelectBackground: false });
  }

  renderSubtitle(timer) {
    return <TimerListSubtitle myTimer={timer} />;
  }

  renderListItems() {
    if (!this.props.timer.timers) {
      return null;
    }

    return this.props.timer.timers.map(timer => {
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
        <ListItem
          key={timer.id}
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
            value: getTimerDescription(timer.duration),
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

    if (this.state.showSelectBackground) {
      return (
        <BackgroundSelection
          selectedBackground={this.props.timer.appBackground}
          onChange={this.onBackgroundChange.bind(this)}
        />
      );
    }

    // TODO make title fancier
    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Image style={styles.title} source={TITLE_IMAGE} />
            <Avatar
              small
              rounded
              icon={{ name: 'add' }}
              onPress={() => this.props.showAddDialog(c.ADD_MODE)}
              activeOpacity={0.7}
              containerStyle={styles.addButton}
            />
          </View>
          <ScrollView>
            <List containerStyle={styles.list}>{this.renderListItems()}</List>
          </ScrollView>
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
          <View style={styles.bottomButtonContainer}>
            <Avatar
              medium
              rounded
              icon={{ name: 'photo-library' }}
              onPress={() => this.setState({ showSelectBackground: true })}
              activeOpacity={0.7}
              containerStyle={styles.bottomButton}
            />
            <Avatar
              medium
              rounded
              icon={{ name: 'description' }}
              onPress={() => console.log('do info screen')}
              activeOpacity={0.7}
              containerStyle={styles.bottomButton}
            />
          </View>
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    width: SCREEN_WIDTH
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH
  },

  title: {
    marginTop: 30,
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
  bottomButton: {
    backgroundColor: 'white',
    margin: 10
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
  closeAddDialog,
  changeBackground
})(TimerList);
