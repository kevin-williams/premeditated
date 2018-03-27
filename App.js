import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { AppFontLoader } from './src/utils';

import reducers from './src/reducers';

import TimerList from './src/containers/timer/TimerList';

import WheelPicker from './src/components/WheelPicker';

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

// const test = (<View style={styles.container}>
//   <TimerList />          </View>
// );
// const test2 = <WheelPicker items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} />;


const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
