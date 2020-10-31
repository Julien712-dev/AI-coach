import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Overriding the header
DetailsScreen['navigationOptions'] = screenProps => ({
	title: "",
	headerLeft: () => <Ionicons name={'ios-arrow-back'} size={30} color={'dodgerblue'} style={{ paddingLeft: 10 }} onPress={() => screenProps.navigation.goBack()} />
})

// screen for demo purpose
export default function DetailsScreen({ navigation }) {
	return (
		<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{padding: 20}}>
				<Text>This is the log diet page.</Text>
			</ScrollView>
		</View>
	);
}