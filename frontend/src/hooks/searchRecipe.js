import { useState, useEffect } from "react";
import spoonacular from "../api/spoonacular";

//import { fetchFavListAsync, fetchBlklistAsync } from '../../actions/profileActions'
import useProfileFirebase from "./useProfileFirebase";

export default () => {
  const apiKey = "24d701faa961453a88deb86494e8e39d";
  const [recipeResults, setRecipeResults] = useState(null);
  const [restaurantResults, setRestaurantResults] = useState(null);

  const { cuisineList, fetchCuisineListAsync } = useProfileFirebase();

  const cuisineTypeGenerator = () => {
    const cuisineTypesAvailable = [
      "Chinese",
      "Japanese",
      "Korean",
      "French",
      "American",
      "Thai",
      "Vietnamese",
      "Italian",
    ];
    var n = 2;
    randomItems = cuisineTypesAvailable
      .sort(() => 0.5 - Math.random())
      .slice(0, n);

    return randomItems.toString();
  };

  // dataList format === { 'a': 1, 'b': 2, 'c': 3}
  const weightedRandom = (dataList, number) => {
    let items = Object.keys(dataList);
    let weights = Object.values(dataList);
    let randomChoices = {};
    let i = 0;
    for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;
    for (let j = 0; j < number; j++) {
      var random = Math.random() * weights[weights.length - 1];
      for (i = 0; i < weights.length; i++) if (weights[i] > random) break;
      if (randomChoices[items[i]] != null) randomChoices[items[i]] += 1;
      else randomChoices[items[i]] = 1;
    }
    return randomChoices;
  };

  const searchByName = async ({
    keyword,
    type = "lunch",
    excludeIngredients,
    minCarbs,
    maxCarbs,
    minProtein,
    maxProtein,
    minCalories,
    maxCalories,
    minFat,
    maxFat,
  }) => {
    try {
      console.log({
        type,
        minCarbs,
        maxCarbs,
        maxProtein,
        minCalories,
        maxCalories,
        maxFat,
      });

      let cuisineTypes = cuisineTypeGenerator();
      console.log(cuisineTypes);
      const response = await spoonacular.get("/complexSearch", {
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
          number: 4,
        },
      });
      setRecipeResults(response.data.results);
      //console.log(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  const searchByNutrients = async (keyword) => {
    try {
      const response = await spoonacular.get("/findByNutrients", {
        params: {
          apiKey,
          minCalories: 50,
          maxCalories: 800,
          number: 3,
        },
      });
      setRecipeResults(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  // number is number of results
  const smartSearch = async (
    number,
    { type = "lunch", minCalories, maxCalories }
  ) => {
    const list = await fetchCuisineListAsync();
    const searchList = weightedRandom(list, number);
    console.log("wr list", searchList);
    let tempResults = [];
    try {
      for (cuisine in searchList) {
        console.log(searchList[cuisine]);
        const response = await spoonacular.get("/complexSearch", {
          params: {
            apiKey,
            cuisine,
            type,
            minCalories,
            maxCalories,
            number: searchList[cuisine],
          },
        });
        // add the cuisine type to the result manually
        response.data.results.forEach((item) => {
          item.cuisineType = cuisine;
        });
        tempResults = tempResults.concat(response.data.results);
      }
      setRecipeResults(tempResults);
      console.log("smart search returned ", tempResults.length, " results");
      return tempResults;
    } catch (e) {
      console.log(e);
    }
  };

  const getRestaurantRecommendations = async ({
    minCarbs,
    maxCarbs,
    minProtein,
    maxProtein,
    minCalories = 350,
    maxCalories,
    minFat,
    maxFat,
  }) => {
    console.log("searching restaurants");
    try {
      let foodItems = [];
      const snapshot = await Firebase.firestore()
        .collection("restaurants")
        .where("menuDataWithNutritionInfo", ">", [])
        .get();
      snapshot.forEach((doc) => {
        let restaurantData = doc.data();
        let recommendedItem = restaurantData.menuDataWithNutritionInfo[0];
        let properItemFound = false;
        for (var item of restaurantData.menuDataWithNutritionInfo) {
          if (item.nutritionValues == "N.A.") continue;
          else if (item.nutritionValues.nf_calories >= minCalories) {
            properItemFound = true;
            recommendedItem = item;
            break;
          }
        }
        if (properItemFound)
          foodItems.push({ ...restaurantData, recommendedItem });
      });
      let results = foodItems.slice(0, 5);
      console.log("results is ", results);
      setRestaurantResults(results);
      return results;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    searchByName,
    searchByNutrients,
    smartSearch,
    getRestaurantRecommendations,
    recipeResults,
    restaurantResults,
  };
};
