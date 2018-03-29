import { Dimensions } from 'react-native';

export * from './AppFontLoader';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const AD_MOB_ID = 'ca-app-pub-6513320241703770/6458258805';

export const getTimerDescription = timer => {
  let hourStr = '';
  if (timer.selectedHours === 1) {
    hourStr = `${timer.selectedHours} hr `;
  } else if (timer.selectedHours > 1) {
    hourStr = `${timer.selectedHours} hrs `;
  }

  let minuteStr = '';
  if (timer.selectedMinutes === 1) {
    minuteStr = `${timer.selectedMinutes} min `;
  } else if (timer.selectedMinutes > 1) {
    minuteStr = `${timer.selectedMinutes} mins `;
  }

  return hourStr + minuteStr;
};
