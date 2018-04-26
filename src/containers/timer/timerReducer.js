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
      title: 'Beginner Meditation',
      backgroundSound: backgroundSounds[1],
      duration: {
        hours: 0,
        mins: 8,
        sound: sounds[3]
      },
      intervals: [
        { name: 'Stretch', hours: 0, mins: 2, sound: sounds[5] },
        { name: 'Sit Comfy', hours: 0, mins: 3, sound: sounds[4] },
        { name: 'Breathe & Focus', hours: 0, mins: 8, sound: sounds[6] }
      ]
    },
    {
      id: 2,
      title: 'Beginner Yoga',
      test: true,
      duration: {
        hours: 0,
        mins: 12,
        sound: sounds[3]
      },
      intervals: [
        { name: 'Mountain', hours: 0, mins: 1, sound: sounds[6] },
        { name: 'Downward Dog', hours: 0, mins: 2, sound: sounds[4] },
        { name: 'Plank', hours: 0, mins: 3, sound: sounds[6] },
        { name: 'Triangle', hours: 0, mins: 4, sound: sounds[5] },
        { name: 'Tree', hours: 0, mins: 5, sound: sounds[6] },
        { name: 'Warrior', hours: 0, mins: 6, sound: sounds[5] },
        { name: 'Forward Bend', hours: 0, mins: 7, sound: sounds[6] },
        { name: 'Bridge', hours: 0, mins: 8, sound: sounds[4] },
        { name: 'Child', hours: 0, mins: 9, sound: sounds[6] },
        { name: 'Cobra', hours: 0, mins: 10, sound: sounds[4] },
        { name: 'Twist', hours: 0, mins: 11, sound: sounds[6] },
        { name: 'Crow', hours: 0, mins: 12, sound: sounds[4] }
      ]
    }
  ],
  appBackground: DEFAULT_BACKGROUND_IMAGE,
  appDataLoadStarted: false
};

export default (state = DEFAULT_STATE, action) => {
  // console.log('timerReducer processing action=', action);

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
    case c.UPDATE_TIMER: {
      const newState = { ...state };
      newState.timers = state.timers.map(
        timer => (timer.id === action.timer.id ? action.timer : timer)
      );

      saveState(newState);
      return newState;
    }

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
    case c.APP_DATA_LOAD_STARTED:
      return { ...state, appDataLoadStarted: true };
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
    appBackgroundName: state.appBackground.name
  };

  try {
    const stateStr = JSON.stringify(newState);
    // console.log('saving state=' + stateStr);
    AsyncStorage.setItem(c.APP_KEY, stateStr);
  } catch (error) {
    console.log('Error saving state', error);
  }
}

function convertOnLoad(state) {
  if (!state) {
    return { ...DEFAULT_STATE, appDataLoadStarted: true };
  }
  const newState = fixBackgroundImage(state);

  newState.timers = fixSounds(state.timers);
  newState.appDataLoadStarted = true;

  // console.log('final state after load', newState);
  return newState;
}

function fixBackgroundImage(state) {
  const newState = { ...state };
  if (!state.appBackgroundName) {
    newState.appBackground = DEFAULT_BACKGROUND_IMAGE;
  } else {
    newState.appBackground = backgrounds.find(
      bg => state.appBackgroundName === bg.name
    );
  }

  // console.log(
  //   `found bg ${newState.appBackground.name} for ${state.appBackgroundName}`
  // );
  return newState;
}

function fixSounds(timers) {
  return timers.map(timer => {
    const newTimer = { ...timer };
    if (timer.backgroundSound) {
      newTimer.backgroundSound = backgroundSounds.find(
        sound => sound.name === timer.backgroundSound.name
      );
    }

    if (timer.duration.sound) {
      newTimer.duration.sound = sounds.find(
        sound => sound.name === timer.duration.sound.name
      );
    }

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
