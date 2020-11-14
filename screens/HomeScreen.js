import * as React from 'react';
import * as Firebase from 'firebase';
import { View } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
	const [login, setLogin] = React.useState('')

	const logout = () => {
		Firebase.auth().signOut()
			.then(() => {
			// Sign-out successful.
		  	})
		  	.catch(() => {
				// An error happened.
		  	});
	}

	Firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
		// User is signed in.
		setLogin('user has login')

  		} else {
		// User is signed out.
		setLogin('user has logout')

  		}
	});

	return (
		<>
		<Appbar.Header>
			<Appbar.Content title="Title" subtitle={'Subtitle'} />
		 	<Appbar.Action icon="magnify" onPress={() => {}} />
	 	</Appbar.Header>
		
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Home screen</Text>
			<Button mode='contained' onPress={() => navigation.navigate('Login')}>
				Go to Login
			</Button>

			<Button mode='contained' onPress={() => logout()}>
				Log out
			</Button>

			<Text>{login}</Text>
		</View>
		</>
	);
}