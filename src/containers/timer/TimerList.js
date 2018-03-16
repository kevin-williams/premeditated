import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Modal, View } from 'react-native';
import { Avatar } from 'react-native-elements';

import TimerCard from './TimerCard';
import AddTimer from './AddTimer';

class TimerList extends Component {
  state = {
    showAddModal: false
  };

  componentWillMount() {
    this.updateList();
  }

  componentWillReceiveProps() {
    this.updateList();
  }

  updateList() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(this.props.timer.timers);
  }

  showAddModal() {
    console.log('showing add modal');
    this.setState({ showAddModal: true });
  }

  closeAddModal() {
    console.log('closing add modal');
    this.setState({ showAddModal: false });
  }

  renderRow(timer) {
    return <TimerCard myTimer={timer} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          tranparent={false}
          visible={this.state.showAddModal}
          onRequestClose={this.closeAddModal.bind(this)}
        >
          <AddTimer closeModal={this.closeAddModal.bind(this)} />
        </Modal>
        <Avatar
          small
          rounded
          title="+"
          onPress={this.showAddModal.bind(this)}
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
