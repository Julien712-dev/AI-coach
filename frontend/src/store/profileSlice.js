import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    firstName: null,
    lastName: null,
    height: null,
    heightUnit: 'cm',
    weight: null,
    weightUnit: 'kg',
    sex: 'M',
    age: null,
    bodyGoal: null,
    physicalFitness: '',
    exerciseDayPerWeek: null,
    exerciseMinutePerDay: null,
    dietHabit: [], // balanced diet, lose weight, build muscles
    dietRestrictions: [],
    foodAllergies: [],
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateTempStorage: (state, action) => {
            return {...state, ...action.payload}
        },
        saveProfileToFirebase: (state, action) => {
            const userRef = action.payload;
            userRef.set({...state});
            // reset state values
            return {...state}
        },
        clearTempStorage: () => initialState
    }
});

const { reducer, actions } = profileSlice;
export const { updateTempStorage, saveProfileToFirebase, clearTempStorage } = actions;
export default reducer;