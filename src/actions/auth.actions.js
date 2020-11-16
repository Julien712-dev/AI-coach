import * as firebase from 'firebase';

export const loginFunc = () => {
  return async dispatch => {
    try {
      dispatch({
        type: "auth/LOGIN",
        user: firebase.auth().currentUser,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const logoutFunc = () => {
  return async dispatch => {
    try {
      dispatch({
        type: "auth/LOGOUT",
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const testingFunc = () => {
  return async dispatch => {
    try {
      dispatch({
        type: "auth/TEST",
      });
    } catch (error) {
      console.log(error);
    }
  };
};
