import React, { useState, useReducer, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import { useTheme, Headline, Text, Snackbar } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as posenet from '@tensorflow-models/posenet';
import ProgressCircle from 'react-native-progress-circle';
import useMountedState from '~/src/hooks/State';
import { useCameraPermission, useCameraRatio } from '~/src/hooks/Camera';
import useTimer from '~/src/hooks/Timer';
import LoadingScreen from '~/src/screens/LoadingScreen';
import MultiDivider from '~/src/components/MultiDivider';
import classificationModelJson from '~/assets/model/exercise/model.json';
import classificationModelWeights from '~/assets/model/exercise/model-weights.bin';

const poseMapping = [
    'leftShoulder',
    'rightShoulder',
    'leftElbow',
    'rightElbow',
    'leftWrist',
    'rightWrist',
    'leftHip',
    'rightHip',
    'leftKnee',
    'rightKnee',
    'leftAnkle',
    'rightAnkle',
];

function calculateAspectRatio(ratio) {
    const [height, width] = ratio.split(':');
    return width / height;
}

function extractFrames(frames, idealTimes) {
    return idealTimes.map(idealTime => {
        let idealFrame;
        let leastTimeDiff = Infinity;
        for (let frame of frames) {
            const timeDiff = Math.abs(frame.timestamp - idealTime);
            if (timeDiff < leastTimeDiff) {
                leastTimeDiff = timeDiff;
                idealFrame = frame;
            }
        }
        return idealFrame;
    });
}

function poseToArray(pose) {
    const boxSize = 100;

    const keypoints = poseMapping.map(part => pose.keypoints.find(keypoint => keypoint.part == part));

    // Standardize to box with fixed size
    const xs = keypoints.map(keypoint => keypoint.position.x);
    const ys = keypoints.map(keypoint => keypoint.position.y);
    const maxX = Math.max(...xs);
    const minX = Math.min(...xs);
    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);
    const maxDiff = Math.max(maxX - minX, maxY - minY);
    const standardizeX = x => (x - minX) / maxDiff * boxSize;
    const standardizeY = y => (y - minY) / maxDiff * boxSize;

    const array = keypoints.flatMap(keypoint => [standardizeX(keypoint.position.x), standardizeY(keypoint.position.y), keypoint.score]);
    return array;
}

function useExerciseClassifier({ posenetModel, lstmModel }, { fps, windowSize, step }, dependencies) {
    const classes = ['push-up-arms-not-bent-enough', 'push-up-normal', 'push-up-waist-too-low']

    const [isPredicting, setIsPredicting] = useMountedState(false);
    const [imageIterator, setImageIterator] = useState(null);
    const [prediction, setPrediction] = useMountedState(null);

    const [frames, reduceFrames] = useReducer((state, action) => {
        switch (action.type) {
            case 'reset':
                for (const frame of state)
                    frame.image.dispose();
                return [];
            case 'add':
                return state.concat([action.frame]);
            case 'used':
                const earliestTime = action.frames[0].timestamp;
                return state.flatMap(frame => {
                    if (frame.timestamp < earliestTime) {
                        frame.image.dispose();
                        return [];
                    } else {
                        const updatedFrame = action.frames.find(f => f.timestamp == frame.timestamp);
                        if (updatedFrame != null)
                            return { ...frame, ...updatedFrame };
                        else
                            return frame;
                    }
                });
        }
    }, []);

    // Reset frames for each exercise
    useEffect(() => reduceFrames({ type: 'reset' }), dependencies);

    // Classify exercise from frames
    useEffect(() => {
        if (posenetModel == null || lstmModel == null || frames.length == 0)
            return;
        if (isPredicting)
            return;

        const latestTime = frames[frames.length - 1].timestamp;
        const earliestTime = frames[0].timestamp;

        if ((latestTime - earliestTime > 1000 * windowSize) && (prediction == null || latestTime - prediction.timestamp > 1000 * step)) {
            const predict = async () => {
                setIsPredicting(true);
                console.time('Classification')
                let idealTimes = [...new Array(windowSize * fps).keys()].map(index => latestTime - index * (1 / fps) * 1000);
                idealTimes.reverse();
                let idealFrames = extractFrames(frames, idealTimes);
                for (let frame of idealFrames)
                    if (frame.pose == null)
                        frame.pose = poseToArray(await posenetModel.estimateSinglePose(frame.image));
                const timeseries = tf.tensor([idealFrames.map(frame => frame.pose)]);
                const prediction = await lstmModel.executeAsync(timeseries);
                const classIndex = tf.squeeze(prediction).argMax();
                const uniqueIdealFrames = idealFrames.filter((value, index, array) => array.indexOf(value) == index);
                setPrediction({ timestamp: latestTime, numFrames: uniqueIdealFrames.length, class: classes[await classIndex.data()] });
                timeseries.dispose();
                prediction.dispose();
                classIndex.dispose();
                reduceFrames({ type: 'used', frames: idealFrames });
                console.timeEnd('Classification');
                setIsPredicting(false);
            };
            predict();
        }
    }, [posenetModel, lstmModel, classes, frames, isPredicting]);

    // Collect tensors from camera
    useLayoutEffect(() => {
        let animationFrame;
        const loop = async () => {
            if (imageIterator != null) {
                const image = await imageIterator.next().value;
                const timestamp = (new Date()).getTime();
                reduceFrames({ type: 'add', frame: { image, timestamp } });
            }
            animationFrame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrame);
    }, [imageIterator]);

    return [prediction, setImageIterator];
}

const TensorCamera = cameraWithTensors(Camera);

function CustomProgressCircle({ children, percent }) {
    const { colors } = useTheme();
    return (
        <ProgressCircle
            percent={percent}
            radius={100}
            borderWidth={8}
            color={colors.primary}
            shadowColor={colors.border}
            bgColor={colors.background}
            outerCircleStyle={{ marginTop: 10 }}
        >
            {children}
        </ProgressCircle>);
}

function DoExerciseScreen({ index, exercise, posenetModel, lstmModel, onComplete }) {
    const imageWidth = 300;

    const description = useSelector(state => state.main.exercise.library[exercise.type]);
    const { colors } = useTheme();

    const timeElapsed = useTimer([index], 100);
    const secondsElapsed = Math.floor(timeElapsed / 1000);

    const [cameraRef, adjustCameraRatio, cameraRatio] = useCameraRatio('4:3');
    const cameraAspectRatio = calculateAspectRatio(cameraRatio);

    const [exercisePrediction, setImageIterator] = useExerciseClassifier({ posenetModel, lstmModel }, { fps: 5, windowSize: 5, step: 3 }, [index]);

    // Check if countdown is finished
    useEffect(() => {
        if ((description.lengthUnit == 'seconds' && secondsElapsed >= exercise.length))
            onComplete();
    }, [exercise, description, secondsElapsed]);

    useEffect(() => console.log(exercisePrediction), [exercisePrediction]);

    const onCameraReady = imageIterator => {
        adjustCameraRatio();
        setImageIterator(imageIterator);
    };

    if (description.lengthUnit == 'reps')
        var progressContent = (
            <TouchableOpacity onLongPress={onComplete}>
                <CustomProgressCircle percent={0}>
                    <Text style={{ fontSize: 50 }}>{exercise.length}</Text>
                    <Text>reps</Text>
                </CustomProgressCircle>
            </TouchableOpacity>
        );
    else if (description.lengthUnit == 'seconds') {
        const secondsLeft = Math.max(0, exercise.length - secondsElapsed);
        const percent = Math.min(100, 100 * (timeElapsed / (exercise.length * 1000)));
        var progressContent = (
            <CustomProgressCircle percent={percent}>
                <Text style={{ fontSize: 50 }}>{secondsLeft}</Text>
                <Text>seconds left</Text>
            </CustomProgressCircle>
        );
    }

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Headline style={{ textAlign: 'center', color: colors.primary }}>{exercise.type}</Headline>
            <TensorCamera
                ref={cameraRef}
                type={Camera.Constants.Type.front}
                style={{ height: '60%', aspectRatio: cameraAspectRatio, marginBottom: 10 }}
                resizeWidth={imageWidth}
                resizeHeight={imageWidth / cameraAspectRatio}
                resizeDepth={3}
                onReady={onCameraReady}
            />
            <MultiDivider thickness={5} />
            {progressContent}
        </View>
    );
}

function RestScreen({ index, nextExercise, onComplete }) {
    const length = 30;

    const { colors } = useTheme();

    const timeElapsed = useTimer([index], 100);
    const secondsElapsed = Math.floor(timeElapsed / 1000);
    const secondsLeft = Math.max(0, length - secondsElapsed);
    const percent = Math.min(100, 100 * (timeElapsed / (length * 1000)));

    // Update progress if countdown is completed
    useEffect(() => {
        if (secondsElapsed >= length)
            onComplete();
    }, [secondsElapsed, length]);

    const nextTip = nextExercise != null ? (
        <Snackbar style={{ marginTop: 'auto' }} visible={true} onDismiss={() => { }}>
            Next up: {nextExercise.type}
        </Snackbar>
    ) : undefined;

    return (
        <View style={{ padding: 20, alignItems: 'center', height: '100%' }}>
            <Headline style={{ textAlign: 'center', color: colors.primary }}>Take a rest</Headline>
            <View style={{ minHeight: '40%', justifyContent: 'center' }}>
                <CustomProgressCircle percent={percent}>
                    <Text style={{ fontSize: 50 }}>{secondsLeft}</Text>
                    <Text>seconds left</Text>
                </CustomProgressCircle>
            </View>
            {nextTip}
        </View>
    );
}

export default function DoWorkoutScreen({ navigation, route }) {
    const { day } = route.params;

    const [lstmModel, setLstmModel] = useState(null);
    const [posenetModel, setPosenetModel] = useState(null);

    const [progress, advanceProgress] = useReducer(state => {
        if (state.stage == 'exercise')
            return { ...state, stage: 'rest' };
        else if (state.stage == 'rest')
            return { stage: 'exercise', index: state.index + 1 };
    }, { stage: 'exercise', index: 0 });
    const workout = useSelector(state => state.main.exercise.plan[day]);
    const exercise = workout.sequence[progress.index];

    const hasCameraPermission = useCameraPermission();

    // Initialize tensorflow
    useEffect(() => {
        const initialize = async () => {
            await tf.ready();
            setPosenetModel(await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.5,
                quantBytes: 4
            }));
            setLstmModel(await tf.loadGraphModel(bundleResourceIO(classificationModelJson, classificationModelWeights)));
        };
        const cleanup = () => {
            posenetModel?.dispose();
            lstmModel?.dispose();
            setPosenetModel(null);
            setLstmModel(null);
        };
        initialize();
        return cleanup;
    }, []);

    // Check if workout is finished
    useEffect(() => {
        if ((progress.index == workout.sequence.length - 1 && progress.stage == 'rest') || progress.index >= workout.sequence.length)
            navigation.goBack();
        // Todo
    }, [workout, progress]);

    const isInitialized = hasCameraPermission !== null && posenetModel !== null && lstmModel !== null;

    if (isInitialized) {
        if (hasCameraPermission) {
            if (progress.stage == 'exercise')
                return <DoExerciseScreen index={progress.index} exercise={exercise} posenetModel={posenetModel} lstmModel={lstmModel} onComplete={advanceProgress} />
            else if (progress.stage == 'rest') {
                const isLast = progress.index >= workout.sequence - 1;
                const nextExercise = isLast ? null : workout.sequence[progress.index + 1];
                return <RestScreen index={progress.index} nextExercise={nextExercise} onComplete={advanceProgress} />
            }
        } else
            navigation.goBack();
    } else
        return <LoadingScreen />;
}