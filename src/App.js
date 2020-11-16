import { registerRootComponent } from 'expo'
import React from 'react';
import * as Firebase from 'firebase';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { DraxProvider } from 'react-native-drax';
import merge from 'deepmerge';

// State saving
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store.js";

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

// Prevent duplicate app
if (!Firebase.apps.length) {
	Firebase.initializeApp(firebaseConfig);
}
let DefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'dodgerblue',
	},
}

function App() {
	return (
		<PaperProvider theme={theme}>
			<DraxProvider>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<Router theme={theme}/>
					</PersistGate>
				</Provider>
			</DraxProvider>
		</PaperProvider>
	);
}

export default registerRootComponent(App);