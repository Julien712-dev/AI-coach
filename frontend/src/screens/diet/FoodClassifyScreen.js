import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
//import ImageEditor from "@react-native-community/image-editor";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";

import { Button } from "react-native-paper";

import useFoodModel from "../../hooks/useFoodModel";
import useCamera from "../../hooks/useCamera";

export default function RecognitionScreen() {
  ratio = "1:1";

  const {
    hasPermission,
    hdPhoto,
    ldPhoto,
    takePicture,
    cleanPhoto,
  } = useCamera();
  const {
    ready,
    predictions,
    classifyImage,
    cleanPredictions,
  } = useFoodModel();

  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  if (hasPermission === false || hasPermission === null) {
    return <Text>No access to camera</Text>;
  }

  const pressTakePicture = async () => {
    const uri = await takePicture({ cameraRef });
    await classifyImage(uri);
  };

  const pressRetakePicture = () => {
    cleanPredictions();
    cleanPhoto();
  };
  const CameraPreview = ({ photo }) => {
    return (
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={styles.camera}
      />
    );
  };

  const renderPrediction = (prediction) => {
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    );
  };

  // the screen
  return (
    <View style={styles.container}>
      {hdPhoto ? (
        <CameraPreview photo={hdPhoto} />
      ) : (
        <Camera ref={cameraRef} style={styles.camera} type={type} ratio={ratio}>
          <View style={styles.redSquare}></View>
        </Camera>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pressRetakePicture}>
          <Text style={styles.text}> Retake </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pressTakePicture}
          style={{
            alignSelf: "flex-end",
            width: 70,
            height: 70,
            bottom: 0,
            borderRadius: 50,
            backgroundColor: "#fff",
          }}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.text}>
          Predictions: {predictions ? predictions : "Predicting..."}
        </Text>
        <Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  camera: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 0.25,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  button: {
    flex: 0.3,
    alignSelf: "center",
    alignItems: "center",
  },
  rectangle: {
    borderWidth: 3,
    borderColor: "red",
    width: "70%",
    height: "70%",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
