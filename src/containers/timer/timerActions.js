import * as c from './timerConstants';
import { AsyncStorage } from 'react-native';

export const addTimer = timer => ({
  type: c.ADD_TIMER,
  timer
});

export const deleteTimer = timerId => ({
  type: c.DELETE_TIMER,
  timerId
});

export const updateTimer = timer => ({
  type: c.UPDATE_TIMER,
  timer
});

export const selectTimer = timer => ({
  type: c.SELECT_TIMER,
  timer
});

export const startSelectedTimer = () => ({
  type: c.START_SELECTED_TIMER
});

export const stopSelectedTimer = () => ({
  type: c.STOP_SELECTED_TIMER
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
    })
    .catch(error => console.log('error loading state', error));
};
