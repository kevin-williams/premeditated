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

export const showAddDialog = mode => ({
  type: c.SHOW_ADD_DIALOG,
  mode
});

export const closeAddDialog = () => ({
  type: c.CLOSE_ADD_DIALOG,
  mode: c.NOT_SHOWN
});

export const startSelectedTimer = () => ({
  type: c.START_SELECTED_TIMER
});

export const stopSelectedTimer = () => ({
  type: c.STOP_SELECTED_TIMER
});

export const updateTimer = timer => ({
  type: c.UPDATE_TIMER,
  timer
});

export const loadApp = () => dispatch => {
  AsyncStorage.getItem(c.APP_KEY)
    .then(stateStr => {
      console.log('loaded state=' + stateStr);
      const newState = JSON.parse(stateStr);
      dispatch({
        type: c.APP_DATA_LOADED,
        state: newState
      });
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
