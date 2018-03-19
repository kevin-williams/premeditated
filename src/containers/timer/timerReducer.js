import * as c from './timerConstants';

import { AsyncStorage } from 'react-native';

const DEFAULT_STATE = {
  selectedTimer: undefined,
  timers: [
    {
      id: 1,
      title: 'medium test',
      selectedHours: 0,
      selectedMinutes: 10,
      intervalHours: 0,
      intervalMinutes: 3,
      timerId: undefined,
      intervalId: undefined,
      test: true
    },
    {
      id: 2,
      title: 'short test',
      selectedHours: 0,
      selectedMinutes: 3,
      intervalHours: 0,
      intervalMinutes: 1,
      timerId: undefined,
      intervalId: undefined,
      test: true
    },
    {
      id: 3,
      title: '10 mins',
      selectedHours: 0,
      selectedMinutes: 10,
      intervalHours: 0,
      intervalMinutes: 3,
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
      const timerIdObject = state.timers.reduce(
        (accumulator = { id: 1 }, timer) => {
          console.log('accumlator now=', accumulator);
          if (timer.id > accumulator.id) {
            return { ...accumulator, id: timer.id };
          }

          return accumulator;
        }
      );

      const newId = timerIdObject.id + 1;

      console.log('newId=', newId);

      const newTimer = { ...action.timer, id: newId };

      if (!newTimer.title) {
        newTimer.title = `Timer ${newTimer.id}`;
      }
      console.log('pushing on new timer=', newTimer);
      newState.timers.push(newTimer);
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

    case c.LOAD_APP:
      return action.state;
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
