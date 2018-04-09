import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ImageBackground,
  PanResponder,
  Text,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { SCREEN_WIDTH } from '../utils';

import { backgrounds } from '../../assets/backgrounds/backgrounds';

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export default class BackgroundSelection extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
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

  state = {
    selectedIndex: 0
  };

  componentWillMount() {
    this.setState({ background: this.props.selectedBackground });
  }

  forceSwipe(direction) {
    const newX = direction === 'Right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this.position, {
      toValue: { x: newX, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  }

  onSwipeComplete(direction) {
    const indexChange = direction === 'Right' ? 1 : -1;

    let newIndex = this.state.selectedIndex + indexChange;
    if (newIndex < 0) {
      newIndex = backgrounds.length - 1;
    } else if (newIndex >= backgrounds.length) {
      newIndex = 0;
    }
    const newBackground = backgrounds[newIndex];

    this.setState({ selectedIndex: newIndex, background: newBackground });
    this.position.setValue({ x: 0, y: 0 });
  }

  getCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    };
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
        {...this.panResponder.panHandlers}
      >
        <ImageBackground
          resizeMode="cover"
          source={this.state.background.uri}
          style={styles.backgroundImage}
        >
          <Text>Background</Text>
          <View style={[styles.commonContainer, styles.buttonContainer]}>
            <Avatar
              medium
              rounded
              icon={{ name: 'check' }}
              onPress={() => console.log('save new background')}
              activeOpacity={0.7}
              containerStyle={styles.saveButton}
            />
            <Avatar
              medium
              rounded
              icon={{ name: 'close' }}
              onPress={() => console.log('close dialog')}
              activeOpacity={0.7}
              containerStyle={styles.closeButton}
            />
          </View>
        </ImageBackground>
      </Animated.View>
    );
  }
}

const styles = {
  backgroundImage: {
    flexDirection: 'column',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 25
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(222,222,222,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    flex: 5
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameLabel: {
    fontSize: 18,
    textAlign: 'center'
  },
  nameInput: {
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
    width: 200,
    margin: 10
  },
  intervalContainer: {
    flex: 1
  },
  intervalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  intervalList: {
    marginTop: 5
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  },
  closeButtonTop: {
    backgroundColor: 'rgba(180,180,180,.7)',
    margin: 10
  },
  closeButton: {
    backgroundColor: 'rgba(222, 0, 0, 0.6)'
  },

  commonContainer: {
    backgroundColor: 'rgba(222,222,222,0.7)',
    width: '90%',
    borderRadius: 10,
    padding: 5,
    margin: 5
  }
};

BackgroundSelection.propTypes = {
  selectedBackground: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
