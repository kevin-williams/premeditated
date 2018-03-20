import * as c from './timerConstants';

import { AsyncStorage } from 'react-native';

const DEFAULT_STATE = {
  selectedTimerId: 1,
  runningTimer: undefined,
  timers: [
    {
      id: 1,
      title: '15 min with 5 min interval',
      selectedHours: 0,
      selectedMinutes: 15,
      intervalHours: 0,
      intervalMinutes: 5,
      timerId: undefined,
      intervalId: undefined
    }
  ]
};

export default (state = DEFAULT_STATE, action) => {
  console.log('timerReducer processing action=', action);

  switch (action.type) {
    case c.ADD_TIMER: {
      const newState = { ...state };

      console.log('add timer new state=', newState);
      let newId = 1;
      if (state.timers && state.timers.length > 0) {
        const timerIdObject = state.timers.reduce((accumulator, timer) => {
          console.log('accumlator now=', accumulator);
          if (timer.id > accumulator.id) {
            return { ...accumulator, id: timer.id };
          }

          return accumulator;
        });

        newId = timerIdObject.id + 1;
      }

      console.log('newId=', newId);

      const newTimer = { ...action.timer, id: newId };

      if (!newTimer.title) {
        newTimer.title = `Timer ${newTimer.id}`;
      }
      console.log('pushing on new timer=', newTimer);
      if (!newState.timers) {
        newState.timers = [];
      }
      newState.timers.push(newTimer);
      newState.selectedTimerId = newTimer.id;
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
    case c.SELECT_TIMER: {
      return {
        ...state,
        selectedTimerId: action.timer.id,
        runningTimer: undefined
      };
    }
    case c.START_SELECTED_TIMER: {
      let selectedTimer = {};
      state.timers.map(timer => {
        if (timer.id === state.selectedTimerId) {
          selectedTimer = { ...timer };
        }

        return timer;
      });
      selectedTimer.isRunning = true;
      return { ...state, runningTimer: selectedTimer };
    }
    case c.STOP_SELECTED_TIMER: {
      const timer = state.runningTimer;
      timer.isRunning = false;
      return { ...state, runningTimer: timer };
    }

    case c.APP_DATA_LOADED:
      return { ...action.state };
    case c.APP_DATA_DEFAULT:
      return { ...DEFAULT_STATE };
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
