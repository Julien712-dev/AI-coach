import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import { useTheme, Headline, Text, Snackbar } from 'react-native-paper';
import { CAMERA } from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as posenet from '@tensorflow-models/posenet';
import ProgressCircle from 'react-native-progress-circle';
import usePermissions from '~/src/hooks/usePermissions';
import useCameraRatio from '~/src/hooks/useCameraRatio';
import useTimer from '~/src/hooks/useTimer';
import LoadingScreen from '~/src/screens/LoadingScreen';
import MultiDivider from '~/src/components/MultiDivider';
import { startWorkout, completeRest, completeExercise } from '~/src/store/exerciseSlice';
import exerciseClassifier from '~/src/api/exerciseClassifier';

function calculateAspectRatio(ratio) {
    const [height, width] = ratio.split(':');
    return width / height;
}

function useExerciseClassifier(posenetModel, index) {
    const [imageIterator, setImageIterator] = useState(null);

    // Collect tensors from camera
    useLayoutEffect(() => {
        let animationFrame;
        const predict = async imageTensor => {
            // const image = await imageTensor.dataSync();
            console.time('Pose estimation');
            const pose = await posenetModel.estimateSinglePose(imageTensor);
            console.timeEnd('Pose estimation');
            imageTensor.dispose();
            const timestamp = (new Date()).getTime();
            // const frame = { image, timestamp };
            const response = await exerciseClassifier.post('/update', { frame: 'test', exerciseId: index });
        }
        const loop = async () => {
            if (imageIterator != null) {
                const imageTensor = await imageIterator.next().value;
                if (imageTensor != null)
                    predict(imageTensor);
            }
            animationFrame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrame);
    }, [imageIterator]);

    return setImageIterator;
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

function DoExerciseScreen({ posenetModel, index, exercise, onComplete }) {
    const imageWidth = 300;

    const description = useSelector(state => state.main.exercise.library[exercise.type]);
    const { colors } = useTheme();

    const timeElapsed = useTimer([index], 100);
    const secondsElapsed = Math.floor(timeElapsed / 1000);

    const [cameraRef, adjustCameraRatio, cameraRatio] = useCameraRatio('4:3', { tensor: true });
    const cameraAspectRatio = calculateAspectRatio(cameraRatio);

    const setImageIterator = useExerciseClassifier(posenetModel, index);

    // Check if countdown is finished
    useEffect(() => {
        if ((description.lengthUnit == 'seconds' && secondsElapsed >= exercise.length))
            onComplete();
    }, [exercise, description, secondsElapsed, onComplete]);

    const onCameraReady = async imageIterator => {
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

    const [ posenetModel, setPosenetModel ] = useState(null);
    const { plan, progress } = useSelector(state => state.main.exercise.ongoingWorkout);
    const exercise = plan != null ? plan.sequence[progress.index] : undefined;
    const dispatch = useDispatch();

    const permissions = usePermissions([CAMERA]);

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
        };
        const cleanup = () => {
            posenetModel?.dispose();
            setPosenetModel(null);
        };
        initialize();
        return cleanup;
    }, []);

    useEffect(() => { dispatch(startWorkout({ day })); }, [day]);

    // Check if workout is finished
    useEffect(() => {
        if (plan != null && ((progress.index == plan.sequence.length - 1 && progress.stage == 'rest') || progress.index >= plan.sequence.length))
            navigation.goBack();
        // Todo
    }, [plan, progress, navigation]);

    if (plan == null || permissions == null || permissions.status == 'undecided' || posenetModel == null)
        return <LoadingScreen />;
    else if (permissions.status == 'denied')
        navigation.goBack();
    else {
        if (progress.stage == 'exercise') {
            const onCompleteExercise = video => dispatch(completeExercise({ video }));
            return <DoExerciseScreen posenetModel={posenetModel} index={progress.index} exercise={exercise} onComplete={onCompleteExercise} />
        }
        else if (progress.stage == 'rest') {
            const onCompleteRest = () => dispatch(completeRest());
            const isLast = progress.index >= plan.sequence.length - 1;
            const nextExercise = isLast ? null : plan.sequence[progress.index + 1];
            return <RestScreen index={progress.index} nextExercise={nextExercise} onComplete={onCompleteRest} />
        }
    }
}