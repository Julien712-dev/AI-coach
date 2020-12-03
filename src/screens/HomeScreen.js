import * as Firebase from 'firebase';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Appbar, Title } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logout as logoutAction } from '../store/authSlice';
import LoadingScreen from './LoadingScreen';

export default function HomeScreen({ navigation }) {
	let user = useSelector(state => state.main.auth.user) || {};
	const [isFetched, setIsFetched] = useState(false);
	const [profile, setProfile] = useState(null);
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
		  // The screen is focused
		  // Call any action
		  setIsFetched(false);
		  const userDatabaseRef = Firebase.database().ref(`/users/${user.uid}`);
		  userDatabaseRef.on('value', snapshot => { 
			  let value = snapshot.val();
			  if (!!value) {
				setProfile(value);
			  }
			  setIsFetched(true);
		  });
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	  }, [navigation]);

	useEffect(() => {
		if (!profile && isFetched) {
			navigation.navigate('Entrance Survey');
		};
	}, [isFetched])

	if (!isFetched) {
		return <LoadingScreen />
	} else {
		return (
			<>
			<ScrollView contentContainerStyle={{ padding: 10 }}>
				<View style={{ flex: 1 }}>
					{/* <Title>{JSON.stringify(profile)}</Title> */}
					<Title>Greetings, {profile.profile.firstName}</Title>
					<Button style={styles.btnStyle} mode='contained' onPress={() => navigation.navigate('Entrance Survey')}>
						Manage My Profile
					</Button>
					<Button style={styles.btnStyle} mode='contained' onPress={() => logout()}>
						Log out
					</Button>
				</View>
			</ScrollView>
			</>
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