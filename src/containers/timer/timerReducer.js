import * as c from './timerConstants';

import { AsyncStorage } from 'react-native';

const DEFAULT_STATE = {
  selectedTimer: undefined,
  timers: []
};

export default (state = DEFAULT_STATE, action) => {
  console.log('timerReducer processing action=', action);

  switch (action.type) {
    case c.ADD_TIMER: {
      const newState = { ...state };
      let newId = 1;
      if (state.timers && state.timers.length > 0) {
        const timerIdObject = state.timers.reduce(
          (accumulator = { id: 1 }, timer) => {
            console.log('accumlator now=', accumulator);
            if (timer.id > accumulator.id) {
              return { ...accumulator, id: timer.id };
            }

            return accumulator;
          }
        );

        newId = timerIdObject.id + 1;
      }

      console.log('newId=', newId);

      const newTimer = { ...action.timer, id: newId };

      if (!newTimer.title) {
        newTimer.title = `Timer ${newTimer.id}`;
      }
      console.log('pushing on new timer=', newTimer);
      newState.timers.push(newTimer);
      newState.selectedTimer = newTimer;
      saveState(newState);
      return newState;
    }
    case c.DELETE_TIMER: {
      const newState = { ...state };
      newState.timers = state.timers.filter(
        timer => timer.id !== action.timerId
      );
      saveState(newState);
      return newState;
    }
    case c.UPDATE_TIMER: {
      const newState = { ...state, selectedTimer: action.timer };
      saveState(newState);
      return newState;
    }
    case c.SELECT_TIMER: {
      const timer = { ...action.timer };
      return { ...state, selectedTimer: timer };
    }
    case c.START_SELECTED_TIMER: {
      const timer = state.selectedTimer;
      timer.isRunning = true;
      return { ...state, selectedTimer: timer };
    }
    case c.STOP_SELECTED_TIMER: {
      const timer = state.selectedTimer;
      timer.isRunning = false;
      return { ...state, selectedTimer: timer };
    }

    case c.APP_DATA_LOADED:
      return { ...action.state };
    default:
      return state;
  }
};

function saveState(state) {
  try {
    const stateStr = JSON.stringify(state);
    console.log('saving state=' + stateStr);
    AsyncStorage.setItem(c.APP_KEY, stateStr);
  } catch (error) {
    console.log('Error saving state', error);
  }
}
