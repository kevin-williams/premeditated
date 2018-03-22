import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { AppFontLoader } from './src/utils';

import reducers from './src/reducers';

import TimerList from './src/containers/timer/TimerList';

export default class App extends React.Component {
  render() {
    return (
      <AppFontLoader>
        <Provider
          store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}
        >
          <View style={styles.container}>
            <TimerList />
          </View>
        </Provider>
      </AppFontLoader>
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
