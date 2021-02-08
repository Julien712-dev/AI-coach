import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import DietLoggingFAB from './dietLoggingFAB';
import { computeNutritionValues, getCoachAdvice } from '../../hooks/Nutrition';
import searchRecipe from '../../hooks/searchRecipe';
// location imports
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import LoadingScreen from '../LoadingScreen';
import ShowCard from '../../components/ShowCard'


export default function DietScreenMain({ navigation }) {

	const [message, setMessage] = useState({});
	const [coachAdvice, setCoachAdvice] = useState('');
	const { searchByName, searchByNutrients, getRestaurantRecommendations, results, errorMessage } = searchRecipe();
	const [restaurantMenuItems, setRestaurantMenuItems] = useState([]);
	let profileRedux = useSelector(state => state.main.auth.profile) || {};

	useEffect(() => {
		let currentTime = new Date();
		let meal = config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour()));
		setMessage(meal);
		setCoachAdvice(getCoachAdvice(profileRedux));
		// get location async
		(async () => {

			if (!!profileRedux) {
				let nutritionValues = computeNutritionValues(profileRedux);
	
				await searchByName({
					type: meal.meal,
					minCalories: (meal.meal == 'breakfast' || meal.meal == 'snack') ? undefined : nutritionValues.dailyRecommendedCalories * 0.55 * meal.weight,
					maxCalories: nutritionValues.dailyRecommendedCalories * meal.weight,
					maxCarbs: nutritionValues.maximumDailyCarbsInGrams * meal.weight,
					maxProtein: nutritionValues.maximumDailyProteinInGrams * meal.weight,
					maxFat: nutritionValues.maximumDailyFatsInGrams * meal.weight
				});

				let restaurants = await getRestaurantRecommendations({ 
					minCalories: (meal.meal == 'breakfast' || meal.meal == 'snack') ? undefined : nutritionValues.dailyRecommendedCalories * 0.55 * meal.weight,
					maxCalories: nutritionValues.dailyRecommendedCalories * meal.weight,
				});

				setRestaurantMenuItems(restaurants);
			}

		  })();
	}, []);

	// Render function for recipe item recommendations.
	function _renderRecipeRecommendations({ item, index }) {
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
				description={`${item.recommendedItem.nutritionValues.nf_calories}\n\n${item.name}\n\n${item.address}`} 
				image={item.image} 
			/>
        )
    }

	if (!results) return (<LoadingScreen />)

	return (
		<View style={{ flex:1 }}>
			<ScrollView contentContainerStyle={{padding: 20}}>
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
						data={results}
						containerCustomStyle={{overflow: "visible"}}
						sliderWidth={300}
						itemWidth={300}
						renderItem={_renderRecipeRecommendations}
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
					/>
				</View>
				<View style={{ marginBottom: 80 }}></View>
			</ScrollView>
			<DietLoggingFAB navigation={navigation} />
		</View>
	);
}