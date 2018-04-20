import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';

import SoundPicker from './SoundPicker';
import TimeSelect from './TimeSelect';

import { sounds } from '../../assets/sound/sounds';

export default class TimeEntryEditor extends Component {
  state = { expanded: false };

  renderTimeEntryName() {
    if (this.props.timeEntry && this.props.timeEntry.name != undefined) {
      return (
        <View style={styles.nameContainer}>
          <Text>Interval Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholderTextColor="grey"
            onChangeText={text => this.props.onNameChange(text)}
            placeholder="Interval name"
            underlineColorAndroid="transparent"
            value={this.props.timeEntry.name}
          />
        </View>
      );
    }
  }

  render() {
    let deleteButton = null;
    if (this.props.onDelete) {
      deleteButton = (
        <Avatar
          small
          rounded
          icon={{ name: 'delete-forever' }}
          onPress={() => this.props.onDelete(this.props.timeEntry)}
          activeOpacity={0.7}
          overlaycontainerStyle={styles.deleteButton}
          containerStyle={styles.deleteButtonContainer}
        />
      );
    }

    const expandIconName = this.state.expanded ? 'expand-less' : 'expand-more';

    let expandedRender = null;
    if (this.state.expanded) {
      expandedRender = (
        <View style={styles.rowContainer}>
          {this.renderTimeEntryName()}
          <SoundPicker
            selectedSound={this.props.timeEntry.sound}
            sounds={sounds}
            onChange={newSound => {
              // console.log('interval sound changed', newSound);
              this.props.onSoundChange(newSound);
            }}
          />
        </View>
      );
    }

    return (
      <View style={[styles.mainContainer, this.props.containerStyle]}>
        <View style={styles.rowContainer}>
          <TimeSelect
            style={styles.timeSelect}
            label={this.props.label}
            hours={this.props.timeEntry.hours}
            minutes={this.props.timeEntry.mins}
            onTimeSelected={time => {
              this.props.onTimeChange(time);
            }}
          />
          {deleteButton}
          <Avatar
            small
            rounded
            icon={{ name: expandIconName }}
            onPress={() => this.setState({ expanded: !this.state.expanded })}
            activeOpacity={0.7}
            overlaycontainerStyle={styles.expandButton}
            containerStyle={styles.expandButtonContainer}
          />
        </View>

        {expandedRender}
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flexDirection: 'column'
  },
  nameContainer: {
    flex: 1,
    margin: 5
  },
  nameInput: {
    flex: 1,
    borderWidth: 0.5,
    padding: 5
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeSelect: {
    width: 225,
    margin: 5
  },
  deleteButton: {
    backgroundColor: 'white'
  },
  deleteButtonContainer: {
    alignSelf: 'center',
    margin: 5
  },
  expandButton: {
    backgroundColor: 'grey'
  },
  expandButtonContainer: {
    alignSelf: 'flex-start',
    margin: 5
  }
};

TimeEntryEditor.propTypes = {
  label: PropTypes.string,
  timeEntry: PropTypes.object.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onSoundChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func,
  containerStyle: PropTypes.object
};
