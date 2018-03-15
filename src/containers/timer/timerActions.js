import * as c from './timerConstants';

export const updateTimer = timer => ({
  type: c.UPDATE_TIMER,
  timer
});
