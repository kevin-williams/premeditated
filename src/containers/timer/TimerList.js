import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, View } from 'react-native';
import { Avatar } from 'react-native-elements';

import TimerCard from './TimerCard';

class TimerList extends Component {
  componentWillMount() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(this.props.timer.timers);
  }

  renderRow(timer) {
    return <TimerCard myTimer={timer} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <Avatar
          small
          rounded
          title="+"
          onPress={() => console.log('Do add timer!')}
          activeOpacity={0.7}
          containerStyle={styles.buttonStyle}
        />
        <ListView dataSource={this.dataSource} renderRow={this.renderRow} />
      </View>
    );
  }
}

const styles = {
  buttonStyle: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 30
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = state => state;
export default connect(mapStateToProps)(TimerList);
