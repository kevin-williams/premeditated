import { AsyncStorage } from 'react-native';

import * as c from './timerConstants';

import { backgrounds } from '../../../assets/backgrounds/backgrounds';
import { backgroundSounds } from '../../../assets/sound/background/background_sounds';
import { sounds } from '../../../assets/sound/sounds';

const DEFAULT_BACKGROUND_IMAGE = backgrounds[7];

const DEFAULT_STATE = {
  selectedTimerId: 1,
  showAddEditDialog: c.NOT_SHOWN,
  runningTimer: undefined,
  timers: [
    {
      id: 1,
      title: '15 min with 5 min interval',
      duration: {
        hours: 0,
        mins: 15,
        sound: sounds[3]
      },
      intervals: [
        { name: '5 mins', hours: 0, mins: 5, sound: sounds[4] },
        { name: '10 mins', hours: 0, mins: 10, sound: sounds[4] }
      ]
    }
  ],
  appBackground: DEFAULT_BACKGROUND_IMAGE
};

export default (state = DEFAULT_STATE, action) => {
  console.log('timerReducer processing action=', action);

  switch (action.type) {
    case c.ADD_TIMER: {
      const newState = { ...state };

      let newId = 1;
      if (state.timers && state.timers.length > 0) {
        const timerIdObject = state.timers.reduce((accumulator, timer) => {
          if (timer.id > accumulator.id) {
            return { ...accumulator, id: timer.id };
          }

          return accumulator;
        });

        newId = timerIdObject.id + 1;
      }

      const newTimer = { ...action.timer, id: newId };

      if (!newTimer.title) {
        newTimer.title = `Timer ${newTimer.id}`;
      }

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
    case c.UPDATE_TIMER: {
      const newState = { ...state };
      newState.timers = state.timers.map(timer => {
        if (timer.id === action.timer.id) {
          return action.timer;
        } else {
          return timer;
        }
      });

      saveState(newState);
      return newState;
    }

    case c.SHOW_ADD_DIALOG:
    case c.CLOSE_ADD_DIALOG:
      return { ...state, showAddEditDialog: action.mode };

    case c.CHANGE_BACKGROUND: {
      const newState = { ...state, appBackground: action.background };
      saveState(newState);
      return newState;
    }

    case c.APP_DATA_LOADED: {
      // Check for default background
      const newState = convertOnLoad(action.state);

      return newState;
    }
    case c.APP_DATA_DEFAULT:
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
};

function saveState(state) {
  const newState = {
    timers: state.timers,
    selectedTimerId: state.selectedTimerId,
    applicationBackgroundName: state.appBackground.name
  };

  try {
    const stateStr = JSON.stringify(newState);
    console.log('saving state=' + stateStr);
    AsyncStorage.setItem(c.APP_KEY, stateStr);
  } catch (error) {
    console.log('Error saving state', error);
  }
}

function convertOnLoad(state) {
  if (!state) {
    return DEFAULT_STATE;
  }
  const newState = fixBackgroundImage(state);

  newState.timers = fixSounds(state.timers);

  console.log('final state after load', newState);
  return newState;
}

function fixBackgroundImage(state) {
  const newState = { ...state };
  if (!state.appBackgroundName) {
    newState.appBackground = DEFAULT_BACKGROUND_IMAGE;
  } else {
    backgrounds.map(bg => {
      if (state.appBackgroundName === bg.name) {
        newState.appBackground = bg;
      }
    });
  }

  return newState;
}

function fixSounds(timers) {
  return timers.map(timer => {
    const newTimer = { ...timer };
    newTimer.backgroundSound = backgroundSounds.find(
      sound => sound.name === timer.backgroundSound.name
    );

    newTimer.duration.sound = sounds.find(
      sound => sound.name === timer.duration.sound.name
    );

    newTimer.intervals = newTimer.intervals.map(interval => {
      const newInterval = { ...interval };
      newInterval.sound = sounds.find(
        sound => sound.name === interval.sound.name
      );

      return newInterval;
    });

    return newTimer;
  });
}
