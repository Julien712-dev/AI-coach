import { useState, useRef } from 'react';

export default function useCameraRatio(preferredRatio, { tensor = false }) {
    const [cameraRatio, setCameraRatio] = useState(preferredRatio);
    const cameraRef = useRef(null);
    const onCameraReady = async () => {
        const refCurrent = tensor ? cameraRef.current.camera : cameraRef.current;
        const ratios = await refCurrent.getSupportedRatiosAsync();
        setCameraRatio(ratios.find(r => r === cameraRatio) || ratios[ratios.length - 1])
    };
    return [cameraRef, onCameraReady, cameraRatio];
}