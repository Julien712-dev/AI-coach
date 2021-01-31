import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../config';
import moment, { updateLocale } from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView, ImageBackground, RefreshControl } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import DietLoggingFAB from './dietLoggingFAB';
import { computeNutritionValues, getCoachAdvice } from '../../hooks/Nutrition';
import { fetchFavListAsync } from '../../actions/profileActions'
import searchRecipe from '../../hooks/searchRecipe';
// location imports
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// import Constants from 'expo-constants';


import LoadingScreen from '../LoadingScreen';
import ShowCard from '../../components/ShowCard'
import Popup from '../../components/Popup'

import useLocation from '../../hooks/useLocation'
import { requestPermissionsAsync } from 'expo-camera';

export default function DietScreenMain({ navigation }) {

	const [time, setTime] = useState();
	const [message, setMessage] = useState({});
	const [coachAdvice, setCoachAdvice] = useState('');
	const { searchByName, searchByNutrients, searchSimilarRecipes, getRestaurantRecommendations, results } = searchRecipe();
	// Carousels
	const [recommendedMealCarouselActiveIndex, setRecommendedMealCarouselActiveIndex] = useState(0);
	const [restaurantMenuCarouselActiveIndex, setRestaurantMenuCarouselActiveIndex] = useState(0);
	// Dummy Data
  const [restaurantMenuItems, setRestaurantMenuItems] = useState([]);

  const { requestLocationPermissionAsync, updateLocationAsync, checkPermission, grant, location, district } = useLocation()
  const [showPopup, setShowPopup] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const [favList, setFavList] = useState(null)

	//const [location, setLocation] = useState(null);
  //const [district, setDistrict] = useState(null);
  
  

	let profileRedux = useSelector(state => state.main.auth.profile) || {};

	useEffect(() => {
		let currentTime = new Date();
		let meal = config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour()));
		setTime(currentTime);
		setMessage(meal);
    setCoachAdvice(getCoachAdvice(profileRedux));

		// get location async
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
			  setErrorMsg('Permission to access location was denied');
			  return;
      }
      console.log('check permission second time')
      await checkPermission();
      console.log('outside grant is ', grant);
      (grant === false) ? setShowPopup(true) : setShowPopup(false)
      //await updateLocation()

			if (!!profileRedux) {
				let nutritionValues = computeNutritionValues(profileRedux);
				//console.log(nutritionValues);
	
				await searchByName({
					type: meal.meal,
					minCalories: (meal.meal == 'breakfast' || meal.meal == 'snack') ? undefined : nutritionValues.dailyRecommendedCalories * 0.55 * meal.weight,
					maxCalories: nutritionValues.dailyRecommendedCalories * meal.weight,
					maxCarbs: nutritionValues.maximumDailyCarbsInGrams * meal.weight,
					maxProtein: nutritionValues.maximumDailyProteinInGrams * meal.weight,
					maxFat: nutritionValues.maximumDailyFatsInGrams * meal.weight
        });
			}

			let restaurants = await getRestaurantRecommendations();
			setRestaurantMenuItems(restaurants);

		  })();
	}, [grant]);

	// Fires when users click into the screen
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// The screen is focused
			// Call any action
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
    }, [navigation]);
  
  
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback( async () => {
    setRefreshing(true)
    console.log('refresh pressed')
    
    const list = await fetchFavListAsync()
    console.log(Object.keys(list));
    searchSimilarRecipes({ idList: Object.keys(list), numberOfResults: 4 })

    
    wait(2000).then(() => setRefreshing(false));
  }, []);


    

	// Render function for recipe item recommendations.
	function _renderRecipeRecommendations({item,index}){
    let calorieObj = (item.nutrition.nutrients || []).find(nutrient => nutrient.title=="Calories")
		return (
			<ShowCard title={item.title} id={item.id} description={`${Math.round(calorieObj.amount)} kcal`} image={item.image}/>
		)
  }

	// Render function for restaurant menu item recommendations.
	function _renderRestaurantMenuItems({item,index}){
    return (
			<ShowCard 
				title={item.recommendedItem.itemName} 
				id={item.address} 
				description={`${item.name}\n\n${item.address}`} 
				image={item.image} 
			/>
    )
    }

	if (!results) return (<LoadingScreen />)

	return (
		<View style={{flex:1}}>
      { showPopup ? <Popup title='Location' message='please turn on location' /> : null }
			<ScrollView contentContainerStyle={{padding: 20}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
				<Title style={{fontSize: 25}}>
					{message.title}
				</Title>
				<Text style={{marginBottom: 10}}>
					{message.message}
				</Text>
				<View style={{ marginVertical: 15, alignItems: 'center', justifyContent: 'center' }}>
					<Carousel
						layout={"default"}
						layoutCardOffset={5}
						activeSlideOffset={5}
						// ref={ref => this.carousel = ref}
						data={results}
						containerCustomStyle={{overflow: "visible"}}
						sliderWidth={300}
						itemWidth={300}
						renderItem={_renderRecipeRecommendations}
						onSnapToItem = { index => setRecommendedMealCarouselActiveIndex(index) }
					/>
				</View>
				<Card style={{ width: '100%', marginTop: 10, marginBottom: 15 }}>
					<Card.Title title={`Coach's Advice:`}/>
					<Card.Content>
						<Paragraph>{coachAdvice}</Paragraph>
					</Card.Content>
				</Card>
				<Title style={{fontSize: 25}}>
					Dining out?
				</Title>
				<Text style={{marginBottom: 10}}>
					Stay healthy while eating outside!
				</Text>
				<View style={{ marginVertical: 15, alignItems: 'center', justifyContent: 'center' }}>
					<Carousel
						layout={"default"}
						layoutCardOffset={9}
						data={restaurantMenuItems}
						containerCustomStyle={{overflow: "visible"}}
						sliderWidth={300}
						itemWidth={300}
						renderItem={_renderRestaurantMenuItems}
						onSnapToItem = { index => setRestaurantMenuCarouselActiveIndex(index) }
					/>
				</View>
				<View style={{ marginBottom: 80 }}></View>
			</ScrollView>
			<DietLoggingFAB navigation={navigation} />
		</View>
	);
}