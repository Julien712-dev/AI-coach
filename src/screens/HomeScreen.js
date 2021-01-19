import * as Firebase from 'firebase';
import { View, StyleSheet, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Button, Title, Card, Text, Divider } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { logout as logoutAction } from '../store/authSlice';
import { setPlan } from '../store/exerciseSlice';
import LoadingScreen from './LoadingScreen';

export default function HomeScreen({ navigation }) {
	let user = useSelector(state => state.main.auth.user) || {};
	var plan = {};
	const [isFetched, setIsFetched] = useState(false);
	const [profile, setProfile] = useState(null);
	const [workoutOfTheDay, setWorkoutOfTheDay] = useState(null);
	const today = moment();
	const dispatch = useDispatch();

	const logout = () => {
		Firebase.auth().signOut()
			.then(() => {
			// Sign-out successful.
				dispatch(logoutAction());
		  	})
		  	.catch(() => {
				// An error happened.
			});
	}

	// When the user first login, force the user to complete his profile.
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			console.log('unsub func triggered');
		  // The screen is focused
		  // Call any action
		  setIsFetched(false);
		  const userDatabaseRef = Firebase.database().ref(`/users/${user.uid}`);
		  userDatabaseRef.once('value', snapshot => { 
			  let value = snapshot.val();
			  if (!!value) {
				setProfile(value.profile);
				dispatch(setPlan({ plan: value.exercisePlan }));
				plan = value.exercisePlan;
				for (var prop in plan) {
					if (moment().day(prop).day() == today.day()) {
						console.log(plan[prop]);
						setWorkoutOfTheDay(plan[prop]);
					}
				}
				setIsFetched(true);
			  }
		  });
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	  }, [navigation]);

	useEffect(() => {
		if (!profile && isFetched) {
			navigation.navigate('Entrance Survey');
		};
	}, [isFetched]);

	if (!isFetched) {
		return <LoadingScreen />
	} else {
		return (
			<SafeAreaView>
			<ScrollView contentContainerStyle={{ padding: 10 }}>
				<StatusBar barStyle="dark-content" style="auto" />
				<View style={{ flex: 1 }}>
					<Title>Greetings, {profile.firstName}. Stay healthy!</Title>

					<Title>Your progress this week</Title>

					<View style={{ flex: 1, flexDirection: "column", alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
						<View style={{ width: 200, marginHorizontal: 20, justifyContent: 'center', marginBottom: 15 }}>
							<View style={{ justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{ fontSize: 54, fontWeight: '600' }}>3</Text>
							</View>
							<View style={{ justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{ fontSize: 18 }}>workouts completed</Text>
							</View>
						</View>
						<View style={{ width: 150, marginHorizontal: 20, justifyContent: 'center' }}>
							<View style={{ justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{ fontSize: 28 }}>123</Text>
							</View>
							<View style={{ justifyContent: 'center', alignItems: 'center'}}>
								<Text style={{ fontSize: 12 }}>average calories burnt</Text>
							</View>
						</View>
					</View>
					
					<View style={{ marginBottom: 20 }}>
						<Card>
							<View style={{ flexDirection: 'row', marginTop: 5 }}>
								<View>
									<Title style={{ marginLeft: 15 }}>Food</Title>
								</View>
								<View style={{ flex: 1, alignItems: 'flex-end' }}>
									<Button 
										icon="plus" 
										style={{ alignSelf: 'flex-end' }}
										onPress={() => navigation.navigate('Log Diet')}
									>Log food</Button>
								</View>
							</View>
							<Divider />
						<Card.Content style={{ marginTop: 5 }}>
						<Text>You have not logged your diet yet.</Text>
							<View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
								<Button onPress={() => navigation.navigate('Diet')}> Explore</Button>
							</View>


						</Card.Content>
						</Card>
					</View>

					<View style={{ marginBottom: 20 }}>
					<Card>
							<View style={{ flexDirection: 'row', marginTop: 5 }}>
								<View>
									<Title style={{ marginLeft: 15 }}>Workout</Title>
								</View>
								<View style={{ flex: 1, alignItems: 'flex-end' }}>
									<Button icon="plus" style={{ alignSelf: 'flex-end' }}>Log workout</Button>
								</View>
							</View>
							<Divider />
						<Card.Content style={{ marginTop: 5 }}>
						{workoutOfTheDay.type == 'rest' ? 
							<View>
								<Text>It's rest day!</Text>
								<Text>Try to relax and let your body recover!</Text>
							</View>
						: <View>
							<Title>{workoutOfTheDay.name}</Title>
						</View>}
						{workoutOfTheDay.type != 'rest' && 
						<View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
							<Button>Do Workout</Button>
						</View>}
						</Card.Content>
						</Card>
					</View>

					<Button style={styles.btnStyle} mode='contained' onPress={() => navigation.navigate('Entrance Survey')}>
						Manage My Profile
					</Button>
					<Button style={styles.btnStyle} mode='contained' onPress={() => logout()}>
						Log out
					</Button>
				</View>
			</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  flexDirection: 'column',
	  justifyContent: 'center',
	  alignItems: 'center',
	  padding: 10,
	  // backgroundColor: 'white'
	},
	btnStyle:{
	  margin: 10,
	  alignSelf: "center"
	},
	textInputStyle:{
	  margin: 10
	},
	errorTextStyle:{
	  fontSize: 20,
	  alignSelf: 'center',
	  color:'red'
	}
  })