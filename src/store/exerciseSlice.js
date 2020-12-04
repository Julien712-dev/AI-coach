import { createSlice } from '@reduxjs/toolkit';

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        plan: null,
        planModified: false
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
            let { fromDay, toDay } = action.payload;
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
            let { day, fromIndex, toIndex } = action.payload;
            let sequence = state.plan[day].sequence;
            sequence.splice(toIndex, 0, sequence.splice(fromIndex, 1)[0]);
            state.planModified = true;
        }
    }
});

const { reducer, actions } = exerciseSlice;
export const { setPlan, onSavePlan, swapWorkout, removeWorkout, swapExercise } = actions;
export default reducer;