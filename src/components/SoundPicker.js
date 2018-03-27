import React, { Component } from 'react';
import { Platform, Picker, Text, View } from 'react-native';
import { Audio } from 'expo';

const sounds = [
    {
        "name": "Waterfall",
        "file": "Waterfall.mp3",
        "license": "Recorded by Mike Koenig"
    },
    {
        "name": "Wind",
        "file": "Wind.mp3",
        "license": "Recorded by Mark DiAngelo"
    }
]

const pickers = [];

const selectedSound = new Audio.Sound();


export default class SoundPicker extends Component {

    constructor(props) {
        super(props);
        this.loadPickerItems();
    }

    soundChanged(itemValue) {
        console.log('new sound=' + itemValue);
        this.props.onChange(itemValue);

        // const soundFile = require(`${this.props.path}/${itemValue.file}`);

        // selectedSound.loadAsync(soundFile)
        //     .then(() => selectedSound.playAsync())
        //     .catch((error) => console.log('Error loading sound', error));
    }

    loadPickerItems() {
        if (pickers.length > 0) {
            return;
        }
        sounds.map((sound, index) => {
            pickers.push(<Picker.Item key={`Sound-${index}`} label={sound.name} value={sound.file} />);
        });

        console.log('pickers=', pickers);

    }


    render() {

        return (<View>
            <Text>Background</Text>
            <Picker style={{ width: 300 }}
                selectedValue={this.props.selectedSound}
                onValueChange={this.soundChanged.bind(this)}
            >
                {pickers}
            </Picker>
        </View >);
    }
}