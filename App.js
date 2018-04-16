import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { AppFontLoader } from './src/utils';
import { NativeRouter, Route } from 'react-router-native'

import reducers from './src/reducers';

import TimerList from './src/containers/timer/TimerList';
import AddEditTimer from './src/containers/timer/AddEditTimer';

export default class App extends React.Component {
  render() {
    return (
      <AppFontLoader>
        <Provider
          store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}
        >
          <NativeRouter>
            <Route exact path="/" component={TimerList} />
            <Route path="/AddEditTimer" component={AddEditTimer} />
            <Route path="/BackgroundSelection" component={BackgroundSelection} />
            <Route path="/RunTimer" component={RunTimer} />
            <Route path="/ApplicationInfo" component={ApplicationInfo} />
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
