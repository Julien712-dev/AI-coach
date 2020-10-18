import React from 'react';
import * as Firebase from 'firebase';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';

// Router
import Router from "./router.js";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyBFcIUtiuhVH0-xzx5aiTadgsn4eNUcf8w",
	authDomain: "coach-ai.firebaseapp.com",
	databaseURL: "https://coach-ai.firebaseio.com",
	projectId: "coach-ai",
	storageBucket: "coach-ai.appspot.com",
};

Firebase.initializeApp(firebaseConfig);

let DefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'dodgerblue',
	},
}

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<Router theme={theme}/>
		</PaperProvider>
	);
}