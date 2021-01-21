import { useState, useRef } from 'react';

export default function useCameraRatio(preferredRatio) {
    const [cameraRatio, setCameraRatio] = useState(preferredRatio);
    const cameraRef = useRef(null);
    const onCameraReady = async () => {
        const ratios = await cameraRef.current.getSupportedRatiosAsync();
        setCameraRatio(ratios.find(r => r === cameraRatio) || ratios[ratios.length - 1])
    };
    return [cameraRef, onCameraReady, cameraRatio];
}