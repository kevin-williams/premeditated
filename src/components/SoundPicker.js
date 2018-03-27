import React, { Component } from 'react';
import { Platform, Picker, Text, View } from 'react-native';

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

export default class SoundPicker extends Component {

    constructor(props) {
        super(props);
        this.loadPickerItems();
    }

    state = {
        selectedSound: undefined
    }

    loadPickerItems() {
        sounds.map((sound, index) => {
            pickers.push(<Picker.Item key={`Sound-${index}`} label={sound.name} value={sound} />);
        });

        console.log('pickers=', pickers);

    }


    render() {

        return (<View>
            <Text>Background</Text>
            <Picker style={{ width: 300 }}
                selectedValue={this.state.selectedSound}
                onValueChange={itemValue => { console.log('new sound=' + itemValue); this.setState({ selectedSound: itemValue }) }}
            >
                {pickers}
            </Picker>
        </View >);
    }
}
