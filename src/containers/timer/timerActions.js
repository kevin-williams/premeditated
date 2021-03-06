import { AsyncStorage } from 'react-native';

import * as c from './timerConstants';

export const addTimer = timer => ({
  type: c.ADD_TIMER,
  timer
});

export const deleteTimer = timerId => ({
  type: c.DELETE_TIMER,
  timerId
});

export const selectTimer = timer => ({
  type: c.SELECT_TIMER,
  timer
});

export const updateTimer = timer => ({
  type: c.UPDATE_TIMER,
  timer
});

export const changeBackground = background => ({
  type: c.CHANGE_BACKGROUND,
  background
});

export const loadApp = () => dispatch => {
  dispatch({
    type: c.APP_DATA_LOAD_STARTED
  });

  AsyncStorage.getItem(c.APP_KEY)
    .then(stateStr => {
      // console.log('loaded state=' + stateStr);
      const newState = JSON.parse(stateStr);
      dispatch({
        type: c.APP_DATA_LOADED,
        state: newState
      });

      if (!newState.selectedTimerId && newState.timers.length > 0) {
        newState.selectedTimerId = newState.timers[0].id;
      }

      dispatch({
        type: c.SELECT_TIMER,
        timer: { id: newState.selectedTimerId }
      });
    })
    .catch(error => {
      console.log('error loading state', error);
      dispatch({ type: c.APP_DATA_DEFAULT, state: undefined });
    });
};
