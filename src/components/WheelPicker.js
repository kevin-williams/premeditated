import React, { Component } from 'react';
import { Text, View } from 'react-native';

const items = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }];

export default class WheelPicker extends Component {


    renderItems() {
        items.map((item, index) => {
            console.log('item=', item);
            return <Text key={`wheel-${index}`}>{item.label}</Text>;
        });
    }

    render() {
        return (<View> {this.renderItems()} </View>);
    }
}
