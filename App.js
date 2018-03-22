import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { AppLoading, Font } from 'expo';

import reducers from './src/reducers';
import FontAwesome from './node_modules/@expo/vector-icons/fonts/FontAwesome.ttf';
import MaterialIcons from './node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf';

import TimerList from './src/containers/timer/TimerList';

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    try {
      await Font.loadAsync({
        FontAwesome,
        MaterialIcons
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }

    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <View style={styles.container}>
          <TimerList />
        </View>
      </Provider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
