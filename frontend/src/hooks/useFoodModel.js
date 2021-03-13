import React, { useState, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { fetch, bundleResourceIO } from "@tensorflow/tfjs-react-native";

import Constants from "expo-constants";

import * as jpeg from "jpeg-js";
import * as FileSystem from "expo-file-system";

// this hook is used by FoodClassifyScreen.js

export default function TFModel() {
  const [predictions, setPredictions] = useState("");
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadTestModel();
    return () => {
      model?.dispose();
    };
  }, []);

  const loadModel = async () => {
    console.log("inside model loading");
    const tfReady = await tf.ready();
    const modelJson = await require("../../assets/model/food/model.json");
    const modelWeight = await require("../../assets/model/food/model_weights.bin");
    const m = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeight));
    console.log("m is ", m);
    setModel(m);
  };

  const loadTestModel = async () => {
    console.log("inside test model loading");
    await tf.ready();
    const modelJson = await require("../../assets/model/test/model.json");
    const modelWeight = await require("../../assets/model/test/model_weights.bin");
    const m = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeight)
    );
    setModel(m);
    const zeros = tf.zeros([1, 224, 224, 3]);
    m.predict(zeros).print();
  };

  const testMobilenetModel = async () => {
    console.log("inside mbnet");
    await tf.ready();
    const modelUrl =
      "https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/2";
    const model = await tf.loadGraphModel(modelUrl, { fromTFHub: true });
    const zeros = tf.zeros([1, 224, 224, 3]);
    model.predict(zeros).print();
  };

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    return tf.tensor4d(buffer, [1, height, width, 3]);
  };

  const classifyImage = async (uri) => {
    if (model === undefined || model === null) {
      console.log("model is undefined or null");
      return;
    }
    console.log("received image from: ", uri);
    try {
      const imgB64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const rawImageData = new Uint8Array(
        tf.util.encodeString(imgB64, "base64").buffer
      );

      const imageTensor = imageToTensor(rawImageData);
      const pred = await model.predict(imageTensor).data();
      const predIndex = tf.argMax(pred).toFloat();
      console.log(predIndex);
      setPredictions(predIndex);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanPredictions = () => {
    setPredictions("");
  };

  return { predictions, classifyImage, cleanPredictions };
}
