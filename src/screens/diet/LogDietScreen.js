import React, {useState} from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Searchbar, Button, Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Overriding the header
DetailsScreen['navigationOptions'] = screenProps => ({
	title: "",
	headerLeft: () => <Ionicons name={'ios-arrow-back'} size={30} color={'dodgerblue'} style={{ paddingLeft: 10 }} onPress={() => screenProps.navigation.goBack()} />
})

// screen for demo purpose
export default function DetailsScreen({ navigation }) {

	const [results, setResults] = useState([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const onChangeSearch = query => setSearchQuery(query);

	return (
		<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{padding: 20}}>
				<Searchbar
					style={{ marginBottom: 15 }}
					placeholder="Search for a food item"
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
				<Divider />
				<Divider />
				<Text style={{fontSize: 16, alignSelf: "center", marginVertical: 5}}>Can't find your diet?</Text>
				<Button icon="pencil" mode="contained" style={{ width: 200, alignSelf: "center", marginTop: 10 }} onPress={() => navigation.navigate('Log Diet Details')}>
					Log Manually
				</Button>
			</ScrollView>
		</View>
	);
}