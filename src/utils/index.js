import { Dimensions } from 'react-native';

export * from './AppFontLoader';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const AD_MOB_ID = 'ca-app-pub-6513320241703770/6458258805';

export const getTimerDescription = timeEntry => {
  let hourStr = '';
  if (timeEntry.hours === 1) {
    hourStr = `${timeEntry.hours} hr `;
  } else if (timeEntry.hours > 1) {
    hourStr = `${timeEntry.hours} hrs `;
  }

  let minuteStr = '';
  if (timeEntry.mins === 1) {
    minuteStr = `${timeEntry.mins} min`;
  } else if (timeEntry.mins > 1) {
    minuteStr = `${timeEntry.mins} mins`;
  }

  return hourStr + minuteStr;
};
