import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Searchbar, Button, Divider } from 'react-native-paper';

export default function LogDietDetailsScreen({navigation}) {

    

    return (
		<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{padding: 20}}>
				<Divider />
				<Divider />
				<Text style={{fontSize: 16, alignSelf: "center", marginVertical: 5}}>Can't find your diet?</Text>
			</ScrollView>
		</View>
    )
}