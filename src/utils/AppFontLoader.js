import React from 'react';
import { Alert } from 'react-native';
import { AppLoading, Font } from 'expo';

import MaterialIcons from '../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf';
import Ionicons from '../../node_modules/@expo/vector-icons/fonts/Ionicons.ttf';

class AppFontLoader extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    try {
      await Font.loadAsync({
        MaterialIcons, Ionicons
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
      Alert.alert('Font Error', JSON.stringify(error));
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }

    return this.props.children;
  }
}

export { AppFontLoader };
