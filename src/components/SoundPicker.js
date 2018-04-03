import React, { Component } from 'react';
import { Platform, Picker, Text, View } from 'react-native';
import { Audio } from 'expo';

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
    // if (pickers.length > 0) {
    //   return;
    // }
    // this.props.sounds.map((sound, index) => {
    //   pickers.push(
    //     <Picker.Item
    //       key={`Sound-${index}`}
    //       label={sound.name}
    //       value={sound.file}
    //     />
    //   );
    // });
    // console.log('pickers=', pickers);
  }

  // TODO fix this when I get to doing the sound pickers
  render() {
    return null;
  }
  // render() {

  //     return (<View>
  //         <Text>Background</Text>
  //         <Picker style={{ width: 300 }}
  //             selectedValue={this.props.selectedSound}
  //             onValueChange={this.soundChanged.bind(this)}
  //         >
  //             {pickers}
  //         </Picker>
  //     </View >);
  // }
}
