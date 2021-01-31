import React from 'react'
import firebase from 'firebase'

// There are some console.log() in this file which can be removed in the future.

export const fetchFavListAsync = async () => {
  return await fetchData({ path: '/profile/favList'})
}

export const updateFavList = (recipeId) => {
  updateData({ path: '/profile/favList', data: { [recipeId]: 1} })
}

export const fetchBlkListAsync = async () => {
  return await fetchData({ path: '/profile/favList'})
}

export const updateBlkList = (recipeId) => {
  updateData({ path: '/profile/favList', data: { [recipeId]: 1} })
}


// General functions

export const fetchData = async ({ path }) =>{
  let data
  const { currentUser } = firebase.auth()
  await firebase.database().ref(`/users/${currentUser.uid}${path}`).once("value", (snapshot) => {
    data = snapshot.val()
  })
  return data 
}

export const updateData = async ({ path, data }) => {
  console.log('in updateData, append: ', data, ' to path: ', path);
  const { currentUser } = firebase.auth()
  await firebase.database().ref(`/users/${currentUser.uid}${path}`).update(data).catch((err) => {
    console.log(err);
  })
}

export const setData = async ({ path, data }) => {
  const { currentUser } = firebase.auth()
  await firebase.database().ref(`/users/${currentUser.uid}${path}`).set(data).catch((err) => {
    console.log(err);
  })
}