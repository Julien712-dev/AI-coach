import * as Firebase from 'firebase';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Appbar, Title } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoginScreen from './login/LoginScreen';
import { loginFunc, logoutFunc, testingFunc } from '../actions/auth.actions';

export default function HomeScreen({ navigation }) {
	let user = useSelector(state => state.main.authReducer.user) || {};
	const dispatch = useDispatch();

	const logout = () => {
		Firebase.auth().signOut()
			.then(() => {
			// Sign-out successful.
				dispatch(logoutFunc());
		  	})
		  	.catch(() => {
				// An error happened.
			});
	}

	return (
		<>
		{/* <Appbar.Header>
			<Appbar.Content title="Title" subtitle={'Subtitle'} />
		 	<Appbar.Action icon="magnify" onPress={() => {}} />
	 	</Appbar.Header> */}
		<ScrollView contentContainerStyle={{ padding: 10 }}>
			<View style={{ flex: 1 }}>
				<Title>Greetings, {user.email}</Title>
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