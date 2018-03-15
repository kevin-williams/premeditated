import * as c from './timerConstants';

const DEFAULT_STATE = {
  selectedTimer: {
    selectedHours: 0,
    selectedMinutes: 3,
    intervalHours: 0,
    intervalMinutes: 1,
    timerId: undefined,
    intervalId: undefined
  },
  timers: []
};

export default (state = DEFAULT_STATE, action) => {
  console.log('timerReducer processing action=', action);

  switch (action.type) {
    case c.UPDATE_TIMER:
      return { ...state, selectedTimer: action.timer };
    default:
      return state;
  }
};
