import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import LoginScreen from './login/LoginScreen'

export default function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Home screen</Text>
			<Button mode='contained' onPress={() => navigation.navigate('Login')}>
				Go to Login
			</Button>
		</View>
	);
}