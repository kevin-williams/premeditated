import { Dimensions } from 'react-native';
import { Analytics } from 'expo-analytics';

export * from './AppFontLoader';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const AD_MOB_ID = 'ca-app-pub-6513320241703770/6458258805';

export const MILLIS_PER_MINUTE = 60000;
export const MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;

export const GA = new Analytics('UA-117920354-1');

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

export const getMillisFromTimer = (entry, test) => {
  if (test) {
    return (
      (entry.mins * MILLIS_PER_MINUTE + entry.hours * MILLIS_PER_HOUR) / 10
    );
  }

  return entry.mins * MILLIS_PER_MINUTE + entry.hours * MILLIS_PER_HOUR;
};
