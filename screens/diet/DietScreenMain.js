import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function DietScreenMain({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Diet Screen Main</Text>
			<Button mode='contained' onPress={() => navigation.navigate('Edit Diet')}>
				Edit Diet
			</Button>
		</View>
	);
}