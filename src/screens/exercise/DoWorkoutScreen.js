import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native';
import { useTheme, Headline, Text } from 'react-native-paper';
import { Camera } from 'expo-camera';
import ProgressCircle from 'react-native-progress-circle';
import LoadingScreen from '~/src//screens/LoadingScreen';
import MultiDivider from '~/src/components/MultiDivider';

function calculateAspectRatio(ratio) {
    const [height, width] = ratio.split(':');
    return width / height;
}

export default function DoWorkoutScreen({ navigation, route }) {
    const { day } = route.params;
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [cameraRatio, setCameraRatio] = useState('4:3');
    const [progress, setProgress] = useState(0);
    const cameraRef = useRef(null);
    const workout = useSelector(state => state.main.exercise.plan[day]);
    const dispatch = useDispatch();
    const { colors } = useTheme();
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const exercise = workout.sequence[progress];

    const onCameraReady = async () => {
        const ratios = await cameraRef.current.getSupportedRatiosAsync();
        setCameraRatio(ratios.find(r => r === cameraRatio) || ratios[ratios.length - 1])
    };

    console.log(calculateAspectRatio(cameraRatio));

    if (hasCameraPermission === null)
        return <LoadingScreen />;
    else if (hasCameraPermission)
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Headline style={{ textAlign: 'center', color: colors.primary }}>{exercise.type}</Headline>
                <Camera ref={cameraRef} type={Camera.Constants.Type.front} style={{ height: '60%', aspectRatio: calculateAspectRatio(cameraRatio), marginBottom: 10 }} onCameraReady={onCameraReady} />
                <MultiDivider thickness={5} />
                <ProgressCircle
                    percent={30}
                    radius={100}
                    borderWidth={8}
                    color={colors.primary}
                    shadowColor={colors.border}
                    bgColor={colors.background}
                    outerCircleStyle={{ marginTop: 10 }}
                >
                    <Text style={{ fontSize: 50 }}>7</Text>
                    <Text>out of 40 times</Text>
                </ProgressCircle>
            </View>
        );
    else 
        navigation.goBack();
}