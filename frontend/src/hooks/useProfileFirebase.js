import React, { useState, useEffect } from "react";
import firebase from "firebase";

// There are some console.log() in this file which can be removed in the future.

export default () => {
  const [cuisineList, setCuisineList] = useState(null);

  useEffect(() => {
    fetchCuisineListAsync();
  }, []);

  const fetchCuisineListAsync = async () => {
    let data = await fetchData({ path: "/profile/cuisineList" });
    setCuisineList(data);
    return data;
  };

  const updateCuisineList = ({ cuisineType, change }) => {
    let orginalValue =
      cuisineList[cuisineType] === undefined ? 0 : cuisineList[cuisineType];
    updateData({
      path: "/profile/cuisineList",
      data: { [cuisineType]: orginalValue + change },
    });
  };

  // General functions

  const fetchData = async ({ path }) => {
    const { currentUser } = firebase.auth();
    let data;
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}${path}`)
      .once("value", (snapshot) => {
        data = snapshot.val();
      });
    return data;
  };

  const updateData = async ({ path, data }) => {
    const { currentUser } = firebase.auth();
    console.log("in updateData, append: ", data, " to path: ", path);
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}${path}`)
      .update(data)
      .catch((err) => {
        console.log(err);
      });
  };

  const setData = async ({ path, data }) => {
    const { currentUser } = firebase.auth();
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}${path}`)
      .set(data)
      .catch((err) => {
        console.log(err);
      });
  };

  return { cuisineList, fetchCuisineListAsync, updateCuisineList };
};
