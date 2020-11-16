// Initial State
const initialState = {
    loggedIn: false,
    test: 'test',
    abc: 'def',
};
// Reducers (Modifies The State And Returns A New State)
const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        // Login
        case 'LOGIN': {
            return {
                // State
                ...state,
                // Redux Store
                loggedIn: action.trueFalse,
            }
        }
        // Default
        default: {
            return state;
        }
    }
};
// Exports
export default uiReducer;