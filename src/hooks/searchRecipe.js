import { useState, useEffect } from 'react'
import spoonacular from '../api/spoonacular'

export default () => {
  const apiKey = '24d701faa961453a88deb86494e8e39d'

  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const searchByName = async ({ 
      keyword, 
      type = 'lunch', 
      excludeIngredients, 
      minCarbs, 
      maxCarbs, 
      minProtein, 
      maxProtein,
      minCalories,
      maxCalories,
      minFat,
      maxFat 
    }) => {
    console.log('hi');
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/complexSearch', {
        params: { 
          apiKey,
          cuisine: 'Chinese,French,Japanese,Korean',
          minCalories,
          maxCalories,
          maxCarbs,
          maxProtein,
          maxFat,
          type,
          number: 3
        }
      })
      setResults(response.data.results)
      console.log(response.data.results);
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in searchbyName')
    }
  }

  const searchByNutrients = async (keyword) => {
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/findByNutrients', {
        params: { 
          apiKey, 
          minCalories: 50, 
          maxCalories: 800, 
          number: 3 
        }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in searchbyNutrients')
    }
  }

  const searchSimilarRecipes = async (idList, numberOfResults) => {
    setErrorMessage('')
    console.log('in similar');

    const baseNumber = Math.ceil(idList.length / numberOfResults) * 2
    const resultsArray = []
  
    for (let i = 0; i < favouriteList.length; i += baseNumber) {
      const id = favouriteList[i + Math.floor(Math.random() * baseNumber)]

      try {
        const response = await spoonacular.get(`${id}/similar`, {
          params: { apiKey, id, number: 2 }
        })
        resultsArray.push(response.data.results)
      } catch(e) {
        console.log(e)
        setErrorMessage('Problems in seachSimilarRecipes')
      }
    }

    console.log(resultsArray);
    return resultsArray
  }

  // useEffect(() => {
  //   searchByName('noodle')
  // }, [])

  return {searchByName, searchByNutrients, searchSimilarRecipes, results, errorMessage}
}