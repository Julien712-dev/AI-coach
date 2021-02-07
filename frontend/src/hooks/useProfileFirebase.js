import React, { useState } from 'react'
import firebase from 'firebase'

// There are some console.log() in this file which can be removed in the future.

export default () => {
  const [cuisineList, setCuisineList] = useState(null)

  useEffect(() => {
    fetchCuisineAsync()
  }, [])

  const fetchCuisineListAsync = async () => {
    let l = await fetchData({ path: '/profile/cuisineList'})
    setCuisineList(l)
  }
  
  const updateCuisineList = ({ cusineType, change }) => {
    let orginalValue = cuisineList.cusineType === undefined ? 0 : cuisineList.cusineType
    updateData({ path: '/profile/cuisineList', data: { [cusineType]: orginalValue + change } })
  }
  
  const fetchFavListAsync = async () => {
    return await fetchData({ path: '/profile/favList'})
  }
  
  const updateFavList = (recipeId) => {
    updateData({ path: '/profile/favList', data: { [recipeId]: 1} })
  }
  
  const fetchBlkListAsync = async () => {
    return await fetchData({ path: '/profile/favList'})
  }
  
  const updateBlkList = (recipeId) => {
    updateData({ path: '/profile/favList', data: { [recipeId]: 1} })
  }
  
  // General functions
  
  const fetchData = async ({ path }) =>{
    let data
    const { currentUser } = firebase.auth()
    await firebase.database().ref(`/users/${currentUser.uid}${path}`).once("value", (snapshot) => {
      data = snapshot.val()
    })
    return data 
  }
  
  const updateData = async ({ path, data }) => {
    console.log('in updateData, append: ', data, ' to path: ', path);
    const { currentUser } = firebase.auth()
    await firebase.database().ref(`/users/${currentUser.uid}${path}`).update(data).catch((err) => {
      console.log(err);
    })
  }
  
  const setData = async ({ path, data }) => {
    const { currentUser } = firebase.auth()
    await firebase.database().ref(`/users/${currentUser.uid}${path}`).set(data).catch((err) => {
      console.log(err);
    })
  }

  return { fetchCuisineListAsync, updateCuisineList, cuisineList }
}


