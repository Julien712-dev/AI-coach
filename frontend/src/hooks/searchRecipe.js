import { useState, useEffect } from 'react'
import spoonacular from '../api/spoonacular'
import Firebase from 'firebase';
import '@firebase/firestore'

export default () => {
  const apiKey = '24d701faa961453a88deb86494e8e39d'

  const [results, setResults] = useState(null)

  const cuisineTypeGenerator = () => {
    const cuisineTypesAvailable = ['Chinese', 'Japanese', 'Korean', 'French', 'American', 'Thai', 'Vietnamese', 'Italian']
    var n = 2
        randomItems = cuisineTypesAvailable.sort(() => .5 - Math.random()).slice(0, n);
    
    return randomItems.toString();
  }

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
    try {
      console.log({
        type,
        minCarbs,
        maxCarbs,
        maxProtein,
        minCalories,
        maxCalories,
        maxFat
      })

      let cuisineTypes = cuisineTypeGenerator();
      console.log(cuisineTypes)
      const response = await spoonacular.get('/complexSearch', {
        params: { 
          apiKey,
          cuisine: cuisineTypes,
          minCalories,
          maxCalories,
          // maxCarbs,
          // maxProtein,
          minProtein: 0,
          minCarbs: 0,
          minFat: 0,
          type,
          number: 4
        }
      })
      setResults(response.data.results)
      //console.log(response.data.results);
    } catch(e) {
      console.log(e)
    }
  }

  const searchByNutrients = async (keyword) => {
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
    }
  }

  const searchSimilarRecipes = async ({ idList, numberOfResults }) => {
    console.log('in similar');
    console.log(idList.length, numberOfResults);

    const baseNumber = Math.ceil(idList.length / numberOfResults) * 2
    console.log('base number', baseNumber)
    
    const resultsList = []
  
    for (let i = 0; i < idList.length; i += baseNumber) {
      const id = idList[i + Math.floor(Math.random() * baseNumber)]
      console.log('id: ', id)

      try {
        const response = await spoonacular.get(`/${id}/similar`, {
          params: { apiKey, number: 2 }
        })
        resultsList.push(response.data[0])
        resultsList.push(response.data[1])
      } catch(e) {
        console.log(e)
      }
    }
    console.log(resultsList);
    setResults(resultsList)
  }

  const getRestaurantRecommendations = async () => {

    try {
      let foodItems = [];
      const snapshot = await Firebase.firestore().collection('restaurants').where('menuDataWithNutritionInfo', '>', []).get();
      snapshot.forEach(doc => {
        let restaurantData = doc.data();
        let recommendedItem = restaurantData.menuDataWithNutritionInfo[0];
        let properItemFound = false;
        for (var item of restaurantData.menuDataWithNutritionInfo) {
          if (item.nutritionValues == 'N.A.') continue; 
          else {
            properItemFound = true;
            recommendedItem = item;
          }
        }
        if (properItemFound) foodItems.push({...restaurantData, recommendedItem});
      })

      return foodItems.slice(0,5);

    } catch (e) {
      console.log(e)
    }
  }

  return {searchByName, searchByNutrients, searchSimilarRecipes, getRestaurantRecommendations, results}
}