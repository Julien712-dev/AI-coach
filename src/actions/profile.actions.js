import * as firebase from 'firebase';

export const updateProfile = ({ newData }) => {
    return async dispatch => {
      try {
        dispatch({
          type: 'profile/UPDATE',
          data: newData,
        });
      } catch (error) {
        console.log(error);
      }
    };
  };


  export const saveProfile = () => {
    return async (dispatch, getStates) => {
      try {
        const user = getStates().main.auth.user;
        const profile = getStates().main.profileReducer;
        const profileRef = firebase.database().ref(`users/${user.uid}/profile`);
        profileRef.set({
            ...profile, 
        }).then(() => {
            dispatch({
                type: "profile/SAVE",
            });
        });
      } catch (error) {
        console.log(error);
      }
    };
  };

  export const cacnelProfileUpdate = () => {
    return async dispatch => {
      try {
        dispatch({
          type: "profile/RESET",
        });
      } catch (error) {
        console.log(error);
      }
    };
  };