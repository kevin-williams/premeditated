import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { AppFontLoader } from './src/utils';
import { NativeRouter, Route } from 'react-router-native'

import reducers from './src/reducers';

import RunTimer from './src/containers/timer/RunTimer';
import TimerList from './src/containers/timer/TimerList';
import AddEditTimer from './src/containers/timer/AddEditTimer';
import BackgroundSelection from './src/components/BackgroundSelection';
import ApplicationInfo from './src/components/ApplicationInfo';

export default class App extends React.Component {
  render() {
    return (
      <AppFontLoader>
        <Provider
          store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}
        >
          <NativeRouter>
            <View style={styles.container}>
              <Route exact path="/" component={TimerList} />
              <Route path="/AddEditTimer" component={AddEditTimer} />
              <Route path="/BackgroundSelection" component={BackgroundSelection} />
              <Route path="/RunTimer" component={RunTimer} />
              <Route path="/ApplicationInfo" component={ApplicationInfo} />
            </View>
          </NativeRouter>
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
