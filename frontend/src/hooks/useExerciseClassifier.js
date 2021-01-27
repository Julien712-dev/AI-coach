import { useState, useReducer, useEffect, useLayoutEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import useMountedState from '~/src/hooks/useMountedState';
import exerciseClassifier from '~/src/api/exerciseClassifier';

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

function calculateFps(frames, windowSize) {
    const lastIndex = frames.length - 1;
    let startIndex = lastIndex;
    while (startIndex > 0 && frames[lastIndex].timestamp - frames[startIndex].timestamp < 1000 * windowSize)
        startIndex--;
    const numFrames = lastIndex - startIndex + 1;
    const numSeconds = (frames[lastIndex].timestamp - frames[startIndex].timestamp) / 1000;
    const fps = numFrames / numSeconds;
    return Math.floor(fps);
}

export default function useExerciseClassifier(step, index) {
    const windowSize = 5;

    const [posenetModel, setPosenetModel] = useState(null);
    const [imageIterator, setImageIterator] = useState(null);
    const [isClassifying, setIsClassifying] = useState(false);
    const [classification, setClassification] = useMountedState(null);

    const [fps, setFps] = useReducer((state, action) => {
        const availableFps = [3, 4, 5];
        const minAvailableFps = Math.min(...availableFps);
        if (availableFps.includes(action))
            return action;
        else if (action < minAvailableFps)
            return minAvailableFps;
        else
            return Math.max(...availableFps.filter(afps => afps <= action));
    }, 3);
    const [frames, addFrame] = useReducer((state, action) => {
        if (Array.isArray(action) && action.length == 0)
            return []; // Reset frames
        else {
            if (state.length == 0 || action.timestamp >= state[state.length - 1].timestamp)
                return [...state, action];
            else {
                for (let i = state.length - 1; i > 0; i--)
                    if (action.timestamp >= state[i - 1].timestamp)
                        return [...state.slice(0, i), action, ...state.slice(i)];
                return [action, ...state];
            }
        }
    }, []);

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

    // Reset frames
    useEffect(() => {
        addFrame([]);
        setClassification(null);
    }, [index]);

    // Classify exercise from frames
    useEffect(() => {
        if (frames.length < windowSize * fps || isClassifying)
            return;

        const latestTime = frames[frames.length - 1].timestamp;
        const earliestTime = frames[0].timestamp;

        if ((latestTime - earliestTime < 1000 * windowSize) || (classification != null && latestTime - classification.timestamp < 1000 * step))
            return;

        const classify = async () => {
            setIsClassifying(true);
            setFps(calculateFps(frames, windowSize));
            let idealTimes = [...new Array(windowSize * fps).keys()].map(index => latestTime - index * (1 / fps) * 1000);
            idealTimes.reverse();
            let idealFrames = extractFrames(frames, idealTimes);
            const usedFramedLength = idealFrames.filter((value, index, array) => array.indexOf(value) == index).length;
            const timeseries = [idealFrames.map(frame => frame.pose)];
            const result = await exerciseClassifier.post('/classify', { fps, timeseries });
            const classLabel = result.data[0];
            setClassification({ timestamp: latestTime, usedFramedLength, fps, classLabel });
            setIsClassifying(false);
        };
        classify();

    }, [frames, windowSize, step, fps, classification, isClassifying]);

    // Collect tensors from camera
    useLayoutEffect(() => {
        let animationFrame;
        const loop = async () => {
            if (imageIterator != null) {
                const image = await imageIterator.next().value;
                if (image != null) {
                    const pose = poseToArray(await posenetModel.estimateSinglePose(image));
                    const timestamp = (new Date()).getTime();
                    addFrame({ pose, timestamp });
                    image.dispose();
                }
            }
            animationFrame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrame);
    }, [imageIterator]);

    const isReady = posenetModel != null;
    return [isReady, classification, setImageIterator];
}
