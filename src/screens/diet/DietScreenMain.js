import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import DietLoggingFAB from './dietLoggingFAB';
import { computeNutritionValues } from '../../hooks/Nutrition';
import searchRecipe from '../../hooks/searchRecipe';
// location imports
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import LoadingScreen from '../LoadingScreen';


export default function DietScreenMain({ navigation }) {

	const [time, setTime] = useState();
	const [message, setMessage] = useState({});
	const [coachAdvice, setCoachAdvice] = useState(`On a day of rest, try to reduce carbohydrate intake and go low calorie overall.`);
	const { searchByName, searchByNutrients, results, errorMessage } = searchRecipe();
	// Carousels
	const [recommendedMealCarouselActiveIndex, setRecommendedMealCarouselActiveIndex] = useState(0);
	// Dummy Data
	const [recommendedMeals, setRecommendedMeals] = useState([
		{
			title:"Oatmeal",
			text: "Oatmeal",
		},
		{
			title:"Fried Rice",
			text: "Fried Rice",
		}
	]);
	const [restaurantMenuCarouselActiveIndex, setRestaurantMenuCarouselActiveIndex] = useState(0);
	// Dummy Data
	const [restaurantMenuItems, setRestaurantMenuItems] = useState([
		{
			title:"Subway Club",
			text: "Subway",
		}, 
		{
			title:"Oatmeal",
			text: "Cafe de Coral",
		},
		{
			title:"Fried Rice",
			text: "Glory Bing Suck",
		}
	]);
	const [location, setLocation] = useState(null);
	const [district, setDistrict] = useState(null);
	let profileRedux = useSelector(state => state.main.auth.profile) || {};

	useEffect(() => {
		let currentTime = new Date();
		let meal = config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour()));
		setTime(currentTime);
		setMessage(meal);
		// get location async
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
			  setErrorMsg('Permission to access location was denied');
			  return;
			}
	  
			let location = await Location.getCurrentPositionAsync({}).then(
				async (response) => {
					console.log(response);
					let postalAddress = await Location.reverseGeocodeAsync(response.coords);
					console.log(postalAddress);
					setLocation(location);
					setDistrict(postalAddress[0].district);
				}
			);

			if (!!location) {
				let postalAddress = await Location.reverseGeocodeAsync(location.coords);
			}

			let nutritionValues = computeNutritionValues(profileRedux);
			console.log(nutritionValues);

			await searchByName({
				meal: meal.meal,
				minCalories: nutritionValues.dailyRecommendedCalories * 0.7 * meal.weight,
				maxCalories: nutritionValues.dailyRecommendedCalories * meal.weight,
				maxCarbs: nutritionValues.maximumDailyCarbsInGrams * meal.weight,
				maxProtein: nutritionValues.maximumDailyProteinInGrams * meal.weight,
				maxFat: nutritionValues.maximumDailyFatsInGrams * meal.weight
			});

			// console.log("Starting Location Update");
			// Location.startLocationUpdatesAsync('TASK_FETCH_LOCATION', {
			//   accuracy: Location.Accuracy.Highest,
			//   distanceInterval: 1, // minimum change (in meters) betweens updates
			//   deferredUpdatesInterval: 10000, // minimum interval (in milliseconds) between updates
			//   // foregroundService is how you get the task to be updated as often as would be if the app was open
			//   foregroundService: {
			// 	notificationTitle: 'Using your location',
			// 	notificationBody: 'To turn off, go back to the app and switch something off.'
			//   },
			// });
	
			// subscriber = await Location.watchPositionAsync(
			//   {
			// 	accuracy: Accuracy.BestForNavigation,
			// 	timeInterval: 1000,
			// 	distanceInterval: 10,
			//   },
			//   () => {
			// 	startWatching(true);
			//   }
			// );
		  })();
	}, []);

	// When the user first login, force the user to complete his profile.
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			console.log('unsub func triggered');
			// The screen is focused
			// Call any action
			// console.log(profileRedux);
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
		}, [navigation]);

	// Render function for recipe item recommendations.
	function _renderRecipeRecommendations({item,index}){
		let calorieObj = (item.nutrition.nutrients || []).find(nutrient => nutrient.title=="Calories")
		return (
			<View style={{borderRadius: 8}}>
				<View style={{
					backgroundColor:'black',
					height: 140,
					borderTopLeftRadius: 5,
					borderTopRightRadius: 5,
				}}>
					<ImageBackground source={{ uri: item.image }} style={{     
						flex: 1,
    					resizeMode: "cover",
    					justifyContent: "center"}} />
				</View>
				<View style={{
					backgroundColor:'floralwhite',
					height: 80,
					padding: 5,
					borderBottomLeftRadius: 5,
					borderBottomRightRadius: 5,
					}}>
					<Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
					<Text>{Math.round(calorieObj.amount)} kcal</Text>
				</View>
			</View>
		)
	}

	// Render function for restaurant menu item recommendations.
	function _renderRestaurantMenuItems({item,index}){
        return (
			<View style={{borderRadius: 8}}>
				<View style={{
					backgroundColor:'black',
					borderTopLeftRadius: 1,
					borderTopRightRadius: 1,
					height: 140,
				}}>
				</View>
				<View style={{
					backgroundColor:'floralwhite',
					height: 80,
					padding: 5,
					borderBottomLeftRadius: 5,
					borderBottomRightRadius: 5,
					}}>
					<Text style={{fontSize: 30}}>{item.title}</Text>
					<Text>{item.text}</Text>
				</View>
		  </View>
        )
    }

	if (!results) return (<LoadingScreen />)

	return (
		<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{padding: 20}}>
				<Title style={{fontSize: 25}}>
					{message.title}
				</Title>
				<Text style={{marginBottom: 10}}>
					{message.message}
				</Text>
				<Carousel
					layout={"default"}
					layoutCardOffset={5}
					activeSlideOffset={5}
					// ref={ref => this.carousel = ref}
					data={results}
					containerCustomStyle={{overflow: "visible"}}
					sliderWidth={250}
					itemWidth={300}
					renderItem={_renderRecipeRecommendations}
					onSnapToItem = { index => setRecommendedMealCarouselActiveIndex(index) }
				/>
				<Card style={{ width: '100%', marginTop: 10, marginBottom: 15 }}>
					<Card.Title title={`Coach's Advice:`}/>
					<Card.Content>
						<Paragraph>{coachAdvice}</Paragraph>
					</Card.Content>
				</Card>
				<Title>Explore Restaurants in {district}!</Title>
				<Carousel
					layout={"default"}
					layoutCardOffset={9}
					data={restaurantMenuItems}
					containerCustomStyle={{overflow: "visible"}}
					sliderWidth={250}
					itemWidth={300}
					renderItem={_renderRestaurantMenuItems}
					onSnapToItem = { index => setRestaurantMenuCarouselActiveIndex(index) }
				/>
			</ScrollView>
			<DietLoggingFAB navigation={navigation} />
		</View>
	);
}

// Background Tasks for defnining 
// console.log("Defining task");
// TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   const [location] = locations;

//   let jobId = await AsyncStorage.getItem('jobId');

//   try {
//     const url = `/deliver-job/location/report`;
//     await rbFleetApi.post(url, { 
//       location, 
//       jobId 
//     }); // you should use post instead of get to persist data on the backend
//   } catch (err) {
//     console.error(err);
//   }
// });