import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';

export function useCameraPermission() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);
    return hasCameraPermission;
}

export function useCameraRatio(preferredRatio) {
    const [cameraRatio, setCameraRatio] = useState(preferredRatio);
    const cameraRef = useRef(null);
    const onCameraReady = async () => {
        const ratios = await cameraRef.current.camera.getSupportedRatiosAsync();
        setCameraRatio(ratios.find(r => r === cameraRatio) || ratios[ratios.length - 1])
    };
    return [cameraRef, onCameraReady, cameraRatio];
}