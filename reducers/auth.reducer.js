const initialState = {
    user: null, // to store the session of the user. when null, user is required to log in
    profile: null,
    testingVariable: 'testtttt',
    abc: 'testt'
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'auth/LOGIN': {
            return {
                ...state,
                user: action.user,
            }
        }
        case 'auth/LOGOUT': {
            return {
                ...state,
                user: null,
            }
        }
        case 'auth/TEST': {
            return {
                ...state,
                abc: "gg",
            }
        }
        default: {
            return state;
        }
    }
};

export default authReducer;