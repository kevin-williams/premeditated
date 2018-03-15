import { combineReducers } from 'redux';
import TimerReducer from '../containers/timer/timerReducer';

export default combineReducers({
  timer: TimerReducer
});
