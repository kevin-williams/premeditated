import { Platform } from "react-native";

const ICONS =
    Platform.select({
        ios: {
            AddIntervals: { name: '' },
            Check: { name: '' },
            Close: { name: '' },
            Delete: { name: '' },
            Description: { name: '' },
            Edit: { name: '' },
            ExpandMore: { name: '' },
            ExpandLess: { name: '' },
            Import: { name: '' },
            MusicNote: { name: '' },
            Pause: { name: '' },
            Play: { name: '' },
            PlusSign: { name: '' },
            Reset: { name: '' },
            SelectImage: { name: '' },
            Share: { name: '' },
            Timer: { name: '' },
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
            Timer: { name: 'av-timer' },
        },
    })


export { ICONS };