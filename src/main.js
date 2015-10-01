'use strict';

var React = require('react-native');
var {
  StyleSheet,
  PanResponder,
  View,
  AppRegistry,
  Dimensions,
  Text
} = React;

var List = require('./list');
var Visual = require('./visual');

var noble = require('react-native-ble');
var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var Wimoto = require('wimoto').Broadcast;

var windowSize = Dimensions.get('window');

var VisualBLE = React.createClass({

  statics: {
    title: 'Visual Noble',
    description: '',
  },

  _panResponder: {},

  getInitialState: function() {
    return {
      peripherals: [],
      index: 0,

      viewers: ['visual', 'list'],
      viewerIndex: 0
    };
  },

  componentWillMount: function() {

    noble.startScanning();
    noble.on('stateChange', this._onStateChange);
    noble.on('discover', this._onPeripheralFound);

    EddystoneBeaconScanner.on('found', function(beacon) {
      console.log('found Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
    });

    EddystoneBeaconScanner.on('updated', function(beacon) {
      console.log('updated Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
    });

    EddystoneBeaconScanner.on('lost', function(beacon) {
      console.log('lost Eddystone beacon:\n', JSON.stringify(beacon, null, 2));
    });

    Wimoto.on('data', function(beacon) {
      console.log('wimoto broadcast:\n', JSON.stringify(beacon, null, 2));
    });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  },

  componentWillUnMount: function(){
    noble.stopScannning();
  },

  componentDidMount: function() {
  },

  render: function() {

   var Peripheral;
   switch(this.state.viewers[this.state.viewerIndex]){
    case 'visual':
      return this.renderVisualView();
    case 'list':
      return this.renderListView();
   }
  },

  renderListView: function() {

    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <List {...this.state}  {...this._panResponder.panHandlers}></List>
      </View>
    );
  },

  renderVisualView: function() {

    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Visual {...this.state}></Visual>
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

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    return true;
  },

  getSwipeDirection: function(e){

    var up = e.nativeEvent.pageY < (windowSize.height / 2);
    var verticalDif = Math.abs(e.nativeEvent.pageY - (windowSize.height / 2));

    var left = e.nativeEvent.pageX < (windowSize.width / 2);
    var horizontalDif = Math.abs(e.nativeEvent.pageX - (windowSize.width / 2));

    var direction;
    if(verticalDif > horizontalDif){
      direction = up ? 'up' : 'down';
    }else{
      direction = left ? 'left' : 'right';
    }
    return direction;
  },

  updateView: function(direction){

    var index = this.state.index;
    var viewerIndex = this.state.viewerIndex;

    switch(direction){
      case 'up':
        if(viewerIndex<this.state.viewers.length-1){
          viewerIndex++;
        }
        break;
      case 'down':
        if(viewerIndex>0){
          viewerIndex--;
        }
        break;
      case 'left':
        if(index<this.state.peripherals.length-1){
          index++;
        }
        break;
      case 'right':
        if(index>0){
          index--;
        }
        break;
    }

    this.setState({
      index, viewerIndex
    });

  },

  _handlePanResponderEnd: function(e: Object, gestureState: Object){

    var direction = this.getSwipeDirection(e);
    console.log(direction);
    this.updateView(direction);
  },

  _onStateChange: function(state) {

    console.log('_onStateChange', state);
    // if (state === 'poweredOn') {
    //   noble.startScanning();
    // } else {
    //   noble.stopScanning();
    // }
  },

  _onPeripheralFound: function(peripheral) {

    console.log(peripheral.uuid);
    EddystoneBeaconScanner.onDiscover(peripheral);
    Wimoto.onDiscover(peripheral);

    var peripherals = this.state.peripherals;
    peripherals.push(peripheral);

    this.setState({
      peripherals
    })
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('VisualBLE', () => VisualBLE);
