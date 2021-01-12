import React, { useState, useReducer, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native';
import { useTheme, Headline, Text, Snackbar } from 'react-native-paper';
import { Camera } from 'expo-camera';
import ProgressCircle from 'react-native-progress-circle';
import LoadingScreen from '~/src//screens/LoadingScreen';
import MultiDivider from '~/src/components/MultiDivider';
import { TouchableOpacity } from 'react-native-gesture-handler';

function calculateAspectRatio(ratio) {
    const [height, width] = ratio.split(':');
    return width / height;
}

function useTimer(dependencies, updateInterval = 10) {
    const [startTime, setStartTime] = useState((new Date()).getTime());
    const [currentTime, setCurrentTime] = useState((new Date()).getTime());
    useEffect(() => {
        let interval = setInterval(() => setCurrentTime((new Date()).getTime()), updateInterval);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        setStartTime((new Date()).getTime());
    }, dependencies);
    return currentTime - startTime;
}

function useCamera(preferredRatio) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [cameraRatio, setCameraRatio] = useState(preferredRatio);
    const cameraRef = useRef(null);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);
    const onCameraReady = async () => {
        const ratios = await cameraRef.current.getSupportedRatiosAsync();
        setCameraRatio(ratios.find(r => r === cameraRatio) || ratios[ratios.length - 1])
    };
    return [cameraRef, onCameraReady, hasCameraPermission, cameraRatio];
}

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

export default function DoWorkoutScreen({ navigation, route }) {
    const restLength = 30;
    const { day } = route.params;
    const [progress, advanceProgress] = useReducer(state => {
        if (state.stage == 'exercise')
            return { ...state, stage: 'rest' };
        else if (state.stage == 'rest')
            return { stage: 'exercise', index: state.index + 1 };
    }, { stage: 'exercise', index: 0 });
    const workout = useSelector(state => state.main.exercise.plan[day]);
    const exercise = workout.sequence[progress.index];
    const exerciseDescription = useSelector(state => state.main.exercise.library[exercise.type]);
    const { colors } = useTheme();
    const timeElapsed = useTimer([progress], 100);
    const secondsElapsed = Math.floor(timeElapsed / 1000);
    const [cameraRef, onCameraReady, hasCameraPermission, cameraRatio] = useCamera('4:3');

    useEffect(() => {
        if ((progress.index == workout.sequence.length - 1 && progress.stage == 'rest') || progress.index >= workout.sequence.length)
            console.log('Finish workout'); // Todo
    }, [workout, progress]);

    useEffect(() => {
        if ((exerciseDescription.lengthUnit == 'seconds' && secondsElapsed >= exercise.length) ||
            (progress.stage == 'rest' && secondsElapsed >= restLength))
            advanceProgress();
    }, [exercise, exerciseDescription, progress, secondsElapsed, restLength]);


    if (hasCameraPermission === null)
        return <LoadingScreen />;
    else if (hasCameraPermission) {
        if (progress.stage == 'exercise') {

            if (exerciseDescription.lengthUnit == 'reps')
                var progressContent = (
                    <TouchableOpacity onLongPress={advanceProgress}>
                        <CustomProgressCircle percent={0}>
                            <Text style={{ fontSize: 50 }}>{exercise.length}</Text>
                            <Text>reps</Text>
                        </CustomProgressCircle>
                    </TouchableOpacity>
                );
            else if (exerciseDescription.lengthUnit == 'seconds') {
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
                    <Camera ref={cameraRef} type={Camera.Constants.Type.front} style={{ height: '60%', aspectRatio: calculateAspectRatio(cameraRatio), marginBottom: 10 }} onCameraReady={onCameraReady} />
                    <MultiDivider thickness={5} />
                    {progressContent}
                </View>
            );
        }
        else if (progress.stage == 'rest') {
            const secondsLeft = Math.max(0, restLength - secondsElapsed);
            const percent = Math.min(100, 100 * (timeElapsed / (restLength * 1000)));
            const nextTip = (progress.index < workout.sequence.length - 1) ? (
                <Snackbar style={{ marginTop: 'auto' }} visible={true} onDismiss={() => { }}>
                    Next up: {workout.sequence[progress.index + 1].type}
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
    }

    else
        navigation.goBack();
}