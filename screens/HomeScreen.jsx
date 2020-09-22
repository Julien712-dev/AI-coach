import React from "react";
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { socketConnect, emitAction } from "../actions/socket.actions.js";
import io from "socket.io-client";
import * as firebase from "firebase";
// import Icon from 'react-native-vector-icons/FontAwesome';

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`
});

class SampleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => {
            this.props.socketConnect();
          }}
          title="connect to server"
          color="#841584"
        />
        <Button
          onPress={() => {
            this.props.emitAction("newMessage", "hiii");
          }}
          title="Emit messages"
          color="#84AA84"
        />
        <TouchableOpacity onPress={() => this.props.socketConnect()} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>{"Connect to Server"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.props.emitAction("newMessage", "hiii"); }} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>{"Emit Messages"}</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
    marginBottom: 10
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = ({ main, secure }) => ({
  user: secure.authReducer.user
});
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      emitAction,
      socketConnect
    },
    dispatch
  );
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(SampleScreen);
