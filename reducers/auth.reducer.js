const initialState = {
    user: null,
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