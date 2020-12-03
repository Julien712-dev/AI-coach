const initialState = {
    firstName: 'John',
    lastName: 'Doe',
    height: 170,
    heightUnit: 'cm',
    weight: 60,
    weightUnit: 'kg',
    sex: 'M',
    age: 18,
    bodyGoal: 'Weight Control',
    exerciseHabit: [],
    includeRunning: false,
    dietHabit: [],
    foodAllergies: [],
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'profile/UPDATE': {
            return {
                ...state,
                ...action.data,
            }
        }
        case 'profile/SAVE': {
            return {
                ...initialState
            }
        }
        case 'profile/RESET': {
            return {
                ...initialState
            }
        }
        default: {
            return state;
        }
    }
};

export default profileReducer;