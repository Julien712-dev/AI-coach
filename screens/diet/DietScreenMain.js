import * as React from 'react';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import DietLoggingFAB from './dietLoggingFAB';


export default function DietScreenMain({ navigation }) {

	const [time, setTime] = React.useState();
	const [message, setMessage] = React.useState({});
	const [coachAdvice, setCoachAdvice] = React.useState(`On a day of rest, try to reduce carbohydrate intake and go low calorie overall.`);
	const [location, setLocation] = React.useState();
	// Carousels
	const [recommendedMealCarouselActiveIndex, setRecommendedMealCarouselActiveIndex] = React.useState(0);
	// Dummy Data
	const [recommendedMeals, setRecommendedMeals] = React.useState([
		{
			title:"Oatmeal",
			text: "Oatmeal",
		},
		{
			title:"Fried Rice",
			text: "Fried Rice",
		}
	]);
	const [restaurantMenuCarouselActiveIndex, setRestaurantMenuCarouselActiveIndex] = React.useState(0);
	// Dummy Data
	const [restaurantMenuItems, setRestaurantMenuItems] = React.useState([
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

	React.useEffect(() => {
		let currentTime = new Date();
		setTime(currentTime);
		setMessage(config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour())))
	}, []);

	// Render function for recipe item recommendations.
	function _renderRecipeRecommendations({item,index}){
		return (
			<>
			<View style={{
				backgroundColor:'black',
				height: 140,
				padding: 5,
			}}>
			</View>
			<View style={{
				backgroundColor:'floralwhite',
				borderRadius: 5,
				height: 80,
				padding: 5,
				}}>
				<Text style={{fontSize: 30}}>{item.title}</Text>
				<Text>{item.text}</Text>
			</View>
			</>
		)
	}

	// Render function for restaurant menu item recommendations.
	function _renderRestaurantMenuItems({item,index}){
        return (
			<>
			<View style={{
				backgroundColor:'black',
				// borderRadius: 5,
				height: 140,
				padding: 5,
				// marginLeft: 5,
				// marginRight: 5
			}}>
			</View>
			<View style={{
				backgroundColor:'floralwhite',
				borderRadius: 5,
				height: 80,
				padding: 5,
				// marginLeft: 5,
				// marginRight: 5, 
				}}>
				<Text style={{fontSize: 30}}>{item.title}</Text>
				<Text>{item.text}</Text>
			</View>
		  </>
        )
    }

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
					data={recommendedMeals}
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
				{/* <Button style={{ marginBottom: 10 }} mode='contained' onPress={() => navigation.navigate('Edit Diet')}>
					Edit Diet
				</Button> */}
				<Title>Explore Restaurants Nearby!</Title>
				<Carousel
					layout={"default"}
					layoutCardOffset={9}
					// ref={ref => this.carousel = ref}
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