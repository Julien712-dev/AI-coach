import React from 'react'
import firebase from 'firebase'

export const updateFavList = async (recipeId) => {
  const { currentUser } = firebase.auth()
  // replace 123 with real user id later !!!
  const favListRef = firebase.database().ref(`/users/123/profile/favList`)
  favListRef.update({[recipeId]: 1})
}

export const updateBlkList = async (recipeId) => {
  const { currentUser } = firebase.auth()
  const blkListRef = firebase.database().ref(`/users/123/profile/blkList`)
  blkListRef.update({[recipeId]: 1})
}

