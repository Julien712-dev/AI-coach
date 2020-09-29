import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper'; 

export default function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Home screen</Text>
			<Button mode='contained' onPress={() => navigation.navigate('Details')}>
				Go to Details
			</Button>
		</View>
	);
}