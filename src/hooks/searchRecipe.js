import { useState, useEffect } from 'react'
import spoonacular from '../api/spoonacular'

export default () => {
  const apiKey = '24d701faa961453a88deb86494e8e39d'

  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const searchByName = async (keyword) => {
    console.log('hi');
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/complexSearch', {
        params: { apiKey, query: keyword, number: 2 }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in searchbyName')
    }
  }

  const searchByNutrients = async (keyword) => {
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/findByNutrients', {
        params: { apiKey, minCalories: 50, maxCalories: 800, number: 2 }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in searchbyNutrients')
    }
  }

  const searchSimilarRecipes = async (id) => {
    setErrorMessage('')
    try {
      const response = await spoonacular.get(`${id}/similar`, {
        params: { apiKey, id, number: 2 }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in seachSimilarRecipes')
    }
  }

  useEffect(() => {
    searchByName('noodle')
  }, [])

  return {searchByName, searchByNutrients, searchSimilarRecipes, results, errorMessage}
}