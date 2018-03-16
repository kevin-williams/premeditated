import * as c from './timerConstants';

const DEFAULT_STATE = {
  selectedTimer: {
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
    case c.UPDATE_TIMER:
      return { ...state, selectedTimer: action.timer };
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
    default:
      return state;
  }
};
