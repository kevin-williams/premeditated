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
    intervalId: undefined
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
      intervalId: undefined
    },
    {
      id: 2,
      title: 'short test',
      selectedHours: 0,
      selectedMinutes: 3,
      intervalHours: 0,
      intervalMinutes: 1,
      timerId: undefined,
      intervalId: undefined
    },
    {
      id: 3,
      title: 'long test',
      selectedHours: 0,
      selectedMinutes: 30,
      intervalHours: 0,
      intervalMinutes: 10,
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
    case c.SELECT_TIMER:
      return { ...state, selectedTimer: action.timer };
    default:
      return state;
  }
};
