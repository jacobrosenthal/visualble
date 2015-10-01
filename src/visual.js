'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text
} = React;

var Visual = React.createClass({
  getDefaultProps: function () {
    return {
      peripherals: [],
      index: 0
    };
  },

  render: function() {
    if (!this.props.peripherals.length>0) {
      return this.renderLoadingView();
    }

    var peripheral = this.props.peripherals[this.props.index];

    return (
      <View
        style={styles.container}>
          <Text>
            Visual View
          </Text>
          <Text style={styles.welcome}>{this.props.index+1} of {this.props.peripherals.length}</Text>
          <Text style={styles.welcome}>{peripheral.uuid}</Text>
      </View>
    );

  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          no devices...
        </Text>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  }
});

module.exports = Visual;