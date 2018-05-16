import { Platform } from 'react-native';

const ICONS = Platform.select({
  ios: {
    AddIntervals: { name: 'ios-code-download', type: 'ionicon' },
    Check: { name: 'ios-checkmark', type: 'ionicon' },
    Close: { name: 'ios-close', type: 'ionicon' },
    Delete: { name: 'ios-trash', type: 'ionicon' },
    Description: { name: 'ios-paper', type: 'ionicon' },
    Edit: { name: 'ios-create', type: 'ionicon' },
    ExpandMore: { name: 'ios-arrow-down', type: 'ionicon' },
    ExpandLess: { name: 'ios-arrow-up', type: 'ionicon' },
    Import: { name: 'ios-download', type: 'ionicon' },
    MusicNote: { name: 'ios-musical-note', type: 'ionicon' },
    Pause: { name: 'ios-pause', type: 'ionicon' },
    Play: { name: 'ios-play', type: 'ionicon' },
    PlusSign: { name: 'ios-add', type: 'ionicon' },
    Reset: { name: 'ios-refresh', type: 'ionicon' },
    SelectImage: { name: 'ios-images', type: 'ionicon' },
    Share: { name: 'ios-share', type: 'ionicon' },
    Timer: { name: 'ios-timer', type: 'ionicon' }
  },
  android: {
    AddIntervals: { name: 'play-for-work' },
    Check: { name: 'check' },
    Close: { name: 'close' },
    Delete: { name: 'delete-forever' },
    Description: { name: 'description' },
    Edit: { name: 'edit' },
    ExpandMore: { name: 'expand-more' },
    ExpandLess: { name: 'expand-less' },
    Import: { name: 'input' },
    MusicNote: { name: 'music-note' },
    Pause: { name: 'pause-circle-outline' },
    Play: { name: 'play-arrow' },
    PlusSign: { name: 'add' },
    Reset: { name: 'refresh' },
    SelectImage: { name: 'collections' },
    Share: { name: 'share' },
    Timer: { name: 'av-timer' }
  }
});

export { ICONS };
