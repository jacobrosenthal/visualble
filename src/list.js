/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  PixelRatio,
} = React;

var List = React.createClass({
  getDefaultProps: function () {
    return {
      peripherals: [],
      index: 0
    };
  },

  render: function() {
    if (!this.props.peripherals.length===0) {
      return this.renderLoadingView();
    }

    var peripheral = this.props.peripherals[this.props.index];
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return (
      <ListView
        dataSource={ds.cloneWithRows(this.props.peripherals)}
        renderRow={this.renderPeripheral}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          No Peripheral
        </Text>
      </View>
    );
  },

  renderPeripheral: function(peripheral) {
    return (
      <View style={styles.row}>
        {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
          * omit a property or set it to undefined if it's inside a shape,
          * even if it isn't required */}
        <Image
          source={{uri: 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851549_767334479959628_274486868_n.png'}}
          style={styles.cellImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {peripheral.advertisement.localName}
          </Text>
          <Text style={styles.movieYear} numberOfLines={1}>
            dog
            {' '}&bull;{' '}
            <Text>
              Critics something
            </Text>
          </Text>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = List;