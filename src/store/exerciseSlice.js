import { createSlice } from '@reduxjs/toolkit';
import DreamFeetVideo from '~/assets/video/dream-feet.mp4';

const exerciseLibrary = {
    'Push up': {
        video: DreamFeetVideo,
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
        labels: ['Leg', 'Glute'],
        instructions: [
            'Stand up with your feet shoulder-width apart.',
            'Bend your knees, press your hips back and stop the movement once the hip joint is slightly lower than the knees.',
            'Press your heels into the floor to return to the initial position.',
        ]
    }
}

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        plan: null,
        planModified: false,
        library: exerciseLibrary
    },
    reducers: {
        setPlan: (state, action) => {
            state.plan = action.payload.plan;
            state.planModified = false;
        },
        onSavePlan: (state) => {
            state.planModified = false;
        },
        swapWorkout: (state, action) => {
            const { fromDay, toDay } = action.payload;
            let temp = state.plan[toDay];
            state.plan[toDay] = state.plan[fromDay];
            state.plan[fromDay] = temp;
            state.planModified = true;
        },
        removeWorkout: (state, action) => {
            delete state.plan[action.payload.day];
            state.planModified = true;
        },
        swapExercise: (state, action) => {
            const { day, fromIndex, toIndex } = action.payload;
            let sequence = state.plan[day].sequence;
            sequence.splice(toIndex, 0, sequence.splice(fromIndex, 1)[0]);
            state.planModified = true;
        },
        changeExerciseLength: (state, action) => {
            const { day, index, length } = action.payload;
            state.plan[day].sequence[index].length = length;
            state.planModified = true;
        }
    }
});

const { reducer, actions } = exerciseSlice;
export const { setPlan, onSavePlan, swapWorkout, removeWorkout, swapExercise, changeExerciseLength } = actions;
export default reducer;