import * as c from './timerConstants';

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
