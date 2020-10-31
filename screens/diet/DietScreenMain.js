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
	const [carouselActiveIndex, setCarouselActiveIndex] = React.useState(0);
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
	}, []);

	// Render function for restaurant menu item recommendations.
	function _renderItem({item,index}){
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
				{/* <Title>{moment(time).format('LLLL')}</Title> */}
				<Text>{config.messages.diet.find(message => (message.startAt < moment(time).hour() && message.endAt >= moment(time).hour())).message}</Text>
				<Title>Your diet Today</Title>
				<Carousel
					layout={"default"}
					layoutCardOffset={5}
					activeSlideOffset={5}
					// ref={ref => this.carousel = ref}
					data={recommendedMeals}
					containerCustomStyle={{overflow: "visible"}}
					sliderWidth={250}
					itemWidth={300}
					renderItem={_renderItem}
					onSnapToItem = { index => setCarouselActiveIndex(index) }
				/>
				<Card style={{ width: '100%', marginTop: 10, marginBottom: 15 }}>
					<Card.Title title={`Coach's Advice:`}/>
					<Card.Content>
						<Paragraph>You are doing great so far! But try not to exercise immediately after lunch, which may hurt your intestine.</Paragraph>
					</Card.Content>
				</Card>
				<Button style={{ marginBottom: 10 }} mode='contained' onPress={() => navigation.navigate('Edit Diet')}>
					Edit Diet
				</Button>
				<Title>Explore Restaurants Nearby!</Title>
				<Carousel
					layout={"default"}
					layoutCardOffset={9}
					// ref={ref => this.carousel = ref}
					data={restaurantMenuItems}
					containerCustomStyle={{overflow: "visible"}}
					sliderWidth={250}
					itemWidth={300}
					renderItem={_renderItem}
					onSnapToItem = { index => setCarouselActiveIndex(index) }
				/>
			</ScrollView>
			<DietLoggingFAB />
		</View>
	);
}