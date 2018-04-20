import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  ScrollView,
  View
} from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { Link } from 'react-router-native';
import { AdMobBanner } from 'expo';

import TimerListSubtitle from './TimerListSubtitle';

import {
  loadApp,
  deleteTimer,
  selectTimer,
  startSelectedTimer,
  changeBackground
} from './timerActions';

import { AD_MOB_ID, SCREEN_WIDTH, getTimerDescription, GA } from '../../utils';
import { ScreenHit } from 'expo-analytics';

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
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (!this.props.timer.appDataLoadStarted) {
      console.log('appDataLoadStarted=', this.props.timer.appDataLoadStarted);
      this.props.loadApp();
    }

    GA.hit(new ScreenHit('TimerList'));
  }

  componentWillUpdate() {
    LayoutAnimation.configureNext(CustomLayoutLinear);
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
    return (
      <ImageBackground
        resizeMode="cover"
        source={this.props.timer.appBackground.uri}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Image
              style={styles.title}
              source={TITLE_IMAGE}
              resizeMode="contain"
            />
            <Link to="/AddEditTimer">
              <Avatar
                small
                rounded
                icon={{ name: 'add' }}
                activeOpacity={0.7}
                containerStyle={styles.addButton}
              />
            </Link>
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
            <Link to="BackgroundSelection">
              <Avatar
                medium
                rounded
                icon={{ name: 'photo-library' }}
                activeOpacity={0.7}
                containerStyle={styles.bottomButton}
              />
            </Link>
            <Link to="/ApplicationInfo">
              <Avatar
                medium
                rounded
                icon={{ name: 'description' }}
                activeOpacity={0.7}
                containerStyle={styles.bottomButton}
              />
            </Link>
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
  changeBackground
})(TimerList);
