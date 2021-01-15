import React, { useState, useReducer, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import { useTheme, Headline, Text, Snackbar } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as posenet from '@tensorflow-models/posenet';
import ProgressCircle from 'react-native-progress-circle';
import { useCameraPermission, useCameraRatio } from '~/src/hooks/Camera';
import useTimer from '~/src/hooks/Timer';
import LoadingScreen from '~/src/screens/LoadingScreen';
import MultiDivider from '~/src/components/MultiDivider';
import classificationModelJson from '~/assets/model/exercise/model.json';
import classificationModelWeights from '~/assets/model/exercise/model-weights.bin';

function calculateAspectRatio(ratio) {
    const [height, width] = ratio.split(':');
    return width / height;
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

function DoExerciseScreen({ index, exercise, onComplete }) {
    const imageWidth = 1000; 

    const [tensorIterator, setTensorIterator] = useState(null);
    const description = useSelector(state => state.main.exercise.library[exercise.type]);
    const { colors } = useTheme();

    const timeElapsed = useTimer([index], 100);
    const secondsElapsed = Math.floor(timeElapsed / 1000);

    const [cameraRef, adjustCameraRatio, cameraRatio] = useCameraRatio('4:3');
    const cameraAspectRatio = calculateAspectRatio(cameraRatio);

    useLayoutEffect(() => {
        let animationFrame;
        const loop = async () => {
            if (tensorIterator != null) {
                const tensor = await tensorIterator.next().value;
                console.log(tensor);
            }
            animationFrame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrame);
    }, [tensorIterator]);

    useEffect(() => {
        if ((description.lengthUnit == 'seconds' && secondsElapsed >= exercise.length))
            onComplete();
    }, [exercise, description, secondsElapsed]);

    const onCameraReady = tensorIterator => {
        adjustCameraRatio();
        setTensorIterator(tensorIterator);
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
        <Snackbar style={{ marginTop: 'auto' }} visible={true} onDismiss={() => {}}>
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

    const [classificationModel, setClassificationModel] = useState(null);
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
        (async () => {
            await tf.ready();
            setPosenetModel(await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.5,
                quantBytes: 4
            }));
            setClassificationModel(await tf.loadGraphModel(bundleResourceIO(classificationModelJson, classificationModelWeights)));
        })();
    }, []);

    // Check if workout is finished
    useEffect(() => {
        if ((progress.index == workout.sequence.length - 1 && progress.stage == 'rest') || progress.index >= workout.sequence.length)
            navigation.goBack();    
            // Todo
    }, [workout, progress]);

    const isInitialized = hasCameraPermission !== null && posenetModel !== null && classificationModel !== null;

    if (isInitialized) {
        if (hasCameraPermission) {
            if (progress.stage == 'exercise')
                return <DoExerciseScreen index={progress.index} exercise={exercise} onComplete={advanceProgress} />
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