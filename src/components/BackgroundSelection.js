import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  Text,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils';

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
        if (gesture.dx > 10) {
          this.setState({ nextIndex: this.getNextIndex(1) });
        } else if (gesture.dx < -10) {
          this.setState({ nextIndex: this.getNextIndex(-1) });
        }
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
    selectedIndex: 0,
    nextIndex: 1
  };

  componentWillMount() {
    let selectedIndex = backgrounds.findIndex(
      bg => this.props.selectedBackground.name === bg.name
    );
    let nextIndex = this.getNextIndex(1);

    this.setState({
      background: this.props.selectedBackground,
      selectedIndex,
      nextIndex
    });
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

    let newIndex = this.getNextIndex(indexChange);
    const newBackground = backgrounds[newIndex];

    this.setState({ selectedIndex: newIndex, background: newBackground });
    this.position.setValue({ x: 0, y: 0 });
  }

  getNextIndex(indexChange) {
    let newIndex = this.state.selectedIndex + indexChange;
    if (newIndex < 0) {
      newIndex = backgrounds.length - 1;
    } else if (newIndex >= backgrounds.length) {
      newIndex = 0;
    }

    return newIndex;
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
      <ImageBackground
        source={backgrounds[this.state.nextIndex].uri}
        style={styles.mainView}
        resizeMode="cover"
      >
        <Animated.View
          style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
          {...this.panResponder.panHandlers}
        >
          <ImageBackground
            source={this.state.background.uri}
            style={styles.currentImage}
            resizeMode="cover"
          >
            <Text style={styles.headerText}>Background Selection</Text>
            <Text style={styles.spacer} />
            <View style={styles.buttonContainer}>
              <Avatar
                medium
                rounded
                icon={{ name: 'check' }}
                onPress={() => {
                  this.props.onChange(backgrounds[this.state.selectedIndex]);
                }}
                activeOpacity={0.7}
                containerStyle={styles.saveButton}
              />
              <Avatar
                medium
                rounded
                icon={{ name: 'close' }}
                onPress={() => this.props.onChange(null)}
                activeOpacity={0.7}
                containerStyle={styles.closeButton}
              />
            </View>
          </ImageBackground>
        </Animated.View>
      </ImageBackground>
    );
  }
}

const styles = {
  mainView: {
    flexDirection: 'column',
    backgroundColor: 'grey',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 25
  },
  headerText: {
    backgroundColor: 'rgba(222,222,222,0.7)',
    textAlign: 'center',
    fontSize: 18
  },
  spacer: { flex: 5 },
  buttonContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    borderRadius: 10,
    padding: 5,
    margin: 5,
    flex: 1
  },
  currentImage: {
    flex: 1
  },
  saveButton: {
    backgroundColor: 'rgba(0, 222, 0, 0.6)'
  },
  closeButton: {
    backgroundColor: 'rgba(222, 0, 0, 0.6)'
  },
  cardStyle: {
    width: SCREEN_WIDTH,
    flex: 1
  }
};

BackgroundSelection.propTypes = {
  selectedBackground: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
