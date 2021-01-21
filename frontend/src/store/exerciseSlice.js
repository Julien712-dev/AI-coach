import { createSlice } from '@reduxjs/toolkit';
import DreamFeetVideo from '~/assets/video/dream-feet.mp4';

const exerciseLibrary = {
    'Push up': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        labels: ['Arm', 'Chest'],
        instructions: [
            'Get down on all fours, placing your hands slightly wider than your shoulders.',
            'Straighten your arms and legs.',
            'Lower your body until your chest nearly touches the floor.',
            'Pause, then push yourself back up.'
        ]
    },
    'Squat': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        labels: ['Leg', 'Glute'],
        instructions: [
            'Stand up with your feet shoulder-width apart.',
            'Bend your knees, press your hips back and stop the movement once the hip joint is slightly lower than the knees.',
            'Press your heels into the floor to return to the initial position.',
        ]
    },
    'Plank': {
        video: DreamFeetVideo,
        lengthUnit: 'seconds',
        labels: ['Glute', 'Core'],
        instructions: [
            'Get in the pushup position, only put your forearms on the ground instead of your hands. Your elbows should line up directly underneath your shoulders. Toes on the ground.',
            'Squeeze your glutes and tighten your abdominals. Keep a neutral neck and spine.',
            'Create a straight, strong line from head to toes – a plank, if you will.',
            'Hold that position.'
        ]
    }
}

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        plan: null,
        planModified: false,
        library: exerciseLibrary,
        ongoingWorkout: {}
    },
    reducers: {
        setPlan: (state, action) => {
            state.plan = action.payload.plan;
            state.draftPlan = action.payload.plan;
            state.planModified = false;
        },
        resetDraftPlan: state => {
            state.draftPlan = state.plan;
            state.planModified = false;
        },
        saveDraftPlan: state => {
            state.plan = state.draftPlan;
            state.planModified = false;
        },
        swapWorkout: (state, action) => {
            const { fromDay, toDay } = action.payload;
            let temp = state.draftPlan[toDay];
            state.draftPlan[toDay] = state.draftPlan[fromDay];
            state.draftPlan[fromDay] = temp;
            state.planModified = true;
        },
        removeWorkout: (state, action) => {
            delete state.draftPlan[action.payload.day];
            state.planModified = true;
        },
        swapExercise: (state, action) => {
            const { day, fromIndex, toIndex } = action.payload;
            let sequence = state.draftPlan[day].sequence;
            sequence.splice(toIndex, 0, sequence.splice(fromIndex, 1)[0]);
            state.planModified = true;
        },
        changeExerciseLength: (state, action) => {
            const { day, index, length } = action.payload;
            state.draftPlan[day].sequence[index].length = length;
            state.planModified = true;
        },
        startWorkout: (state, action) => {
            const { day } = action.payload;
            state.ongoingWorkout = {
                plan: JSON.parse(JSON.stringify(state.plan[day])),
                progress: { stage: 'exercise', index: 0 },
                videos: [],
            }
        },
        completeRest: state => {
            const { progress } = state.ongoingWorkout;
            progress.stage = 'exercise';
            progress.index++;
        },
        completeExercise: (state, action) => {
            const { video } = action.payload;
            const { plan, progress, videos } = state.ongoingWorkout;
            videos[progress.index] = video;
            progress.stage = 'rest';
        }
    }
});

const { reducer, actions } = exerciseSlice;
export const { setPlan, resetDraftPlan, saveDraftPlan, swapWorkout, removeWorkout, swapExercise, changeExerciseLength, startWorkout, completeExercise, completeRest } = actions;
export default reducer;