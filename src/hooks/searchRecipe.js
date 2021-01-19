import { useState, useEffect } from 'react'
import spoonacular from '../api/spoonacular'

export default () => {
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const searchbyName = async (keyword) => {
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/complexSearch', {
        params: { query: keyword, number: 2 }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in searchbyName')
    }
  }

  const searchbyNutrients = async (keyword) => {
    setErrorMessage('')
    try {
      const response = await spoonacular.get('/findByNutrients', {
        params: { minCalories: 50, maxCalories: 800, number: 2 }
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
        params: { id, number: 2 }
      })
      setResults(response.data.results)
    } catch(e) {
      console.log(e)
      setErrorMessage('Problems in seachSimilarRecipes')
    }
  }

  useEffect(() => {
    searchbyName('noodle')
  }, [])

  return [searchAPI, results, errorMessage]
}