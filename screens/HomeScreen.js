import * as Firebase from 'firebase';
import { View } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoginScreen from './login/LoginScreen';
import { loginFunc, logoutFunc, testingFunc } from '../actions/auth.actions';

export default function HomeScreen({ navigation }) {
	let user = useSelector(state => state.main.authReducer.user);
	let rrr = useSelector(state => state.main.authReducer.abc);
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
		<Appbar.Header>
			<Appbar.Content title="Title" subtitle={'Subtitle'} />
		 	<Appbar.Action icon="magnify" onPress={() => {}} />
	 	</Appbar.Header>
		<Text>{rrr}</Text>
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button mode='contained' onPress={() => navigation.navigate('Login')}>
				Go to Login
			</Button>

			<Button mode='contained' onPress={() => logout()}>
				Log out
			</Button>

			<Button mode='contained' onPress={() => dispatch(testingFunc())}>
				Test
			</Button>

		</View>
		</>
	);
}