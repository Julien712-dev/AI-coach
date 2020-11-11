import React, {useState} from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
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
				<Text>This is the edit diet page.</Text>
				<Searchbar
					placeholder="Search for a food item"
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
			</ScrollView>
		</View>
	);
}