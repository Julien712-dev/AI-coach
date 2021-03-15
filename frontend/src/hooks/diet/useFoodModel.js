import { useState, useEffect } from 'react'

import * as tf from '@tensorflow/tfjs'
import { bundleResourceIO } from '@tensorflow/tfjs-react-native'

import * as jpeg from 'jpeg-js'
import * as FileSystem from 'expo-file-system'

// this hook is used by FoodClassifyScreen.js

export default function TFModel() {
  const [ready, setReady] = useState(false)
  const [predictions, setPredictions] = useState('')
  const [model, setModel] = useState(null)

  useEffect( async () => {
    await prepareModel()
    return () => {
      model?.dispose()
    }
  }, [])

  const prepareModel = async () => {
    console.log('inside model loading');
    await tf.ready()
    if (!model) {
      // For custom model, have some layer bug
      const modelJson = require('~/assets/model/food/model.json');
      //const modelWeights = require('../path/to/model_weights.bin');
      const m = await tf
        .loadGraphModel(bundleResourceIO(modelJson, 3))
        .then(() => console.log('success'))
        .catch(err => console.log(err))
      //const m = await mobilenet.load({version: 2, alpha: 1.0})
      setModel(m)
      
    }
    setReady(true)
    console.log('loading model success');
  }

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  const classifyImage = async (uri) => {
    await prepareModel()
    if (model === undefined || model === null || ready === false) {
      console.log('model loading error');
      return
    }
    console.log('received image from: ', uri);
    try {
      const imgB64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const rawImageData = new Uint8Array(tf.util.encodeString(imgB64, 'base64').buffer)  
      
      const imageTensor = imageToTensor(rawImageData)
      const pred = await model.classify(imageTensor)
      console.log(pred);
      setPredictions(pred)

    } catch (error) {
      console.log(error)
    }
  }

  const cleanPredictions = () => {
    setPredictions('')
  }


  return { ready, predictions, classifyImage, cleanPredictions }
}