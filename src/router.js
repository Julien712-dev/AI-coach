import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importing Screens
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import EntranceSurveyScreen from "./screens/survey/EntranceSurveyScreen";

// Diet Screens
import DietScreenMain from "./screens/diet/DietScreenMain";
import EditDietScreen from "./screens/diet/EditDietScreen";
import LogDietScreen from "./screens/diet/LogDietScreen";
import LogDietDetailsScreen from './screens/diet/LogDietDetailsScreen';

// Exercise Screens
import ExerciseMainScreen from "./screens/exercise/ExerciseMainScreen";
import PlanWorkoutScreen from './screens/exercise/PlanWorkoutScreen';
import ViewWorkoutScreen from './screens/exercise/ViewWorkoutScreen';

// Login Screen
import LoginScreen from "./screens/login/LoginScreen";
import SignUpScreen from "./screens/login/SignUpScreen";
import { loginFunc, logoutFunc } from './actions/auth.actions';

// Stacks
const HomeStack = createStackNavigator();

function HomeStackScreen() {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name="Home" component={HomeScreen} />
			<HomeStack.Screen name="Details" component={DetailsScreen} />
			<HomeStack.Screen name="Login" component={LoginScreen} />
		</HomeStack.Navigator>
	);
}

const DietStack = createStackNavigator();

function DietStackScreen() {
	return (
		<DietStack.Navigator>
			<DietStack.Screen name="Diet" component={DietScreenMain} />
			<DietStack.Screen name="Edit Diet" component={EditDietScreen} />
			<DietStack.Screen name="Log Diet" component={LogDietScreen} />
			<DietStack.Screen name="Log Diet Details" component={LogDietDetailsScreen} />
		</DietStack.Navigator>
	)
}

const ExerciseStack = createStackNavigator();

function ExerciseStackScreen() {
	return (
		<ExerciseStack.Navigator>
			<ExerciseStack.Screen name="Exercise" component={ExerciseMainScreen} />
			<ExerciseStack.Screen name="Workout Plan" component={PlanWorkoutScreen} />
			<ExerciseStack.Screen name="View Workout" component={ViewWorkoutScreen} />
		</ExerciseStack.Navigator>
	);
}

// Bottom Tab - Home, Diet and Exercise
const Tab = createBottomTabNavigator();

function BottomTabs() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Home') {
						iconName = focused ? 'ios-list-box' : 'ios-list';
					} else if (route.name === 'Diet') {
						iconName = 'ios-restaurant'
					} else if (route.name === 'Exercise') {
						iconName = 'ios-pulse';
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen name="Home" options={{ headerShown: false }} component={HomeStackScreen} />
			<Tab.Screen name="Diet" options={{ headerShown: false }} component={DietStackScreen} />
			<Tab.Screen name="Exercise" options={{ headerShown: false }} component={ExerciseStackScreen} />
		</Tab.Navigator>
	)
}

const Stack = createStackNavigator();
export default function Routers({ theme }) {

	let user = useSelector(state => state.main.authReducer.user);
	return (
		<NavigationContainer theme={theme}>
			<Stack.Navigator mode='modal' screenOptions={{ headerShown: false }} initialRouteName={!!user ? 'Home' : 'Login'}>
				{!!user ? 
				<>
					<Stack.Screen name="Home" component={BottomTabs} />
					<Stack.Screen name="Entrance Survey" component={EntranceSurveyScreen} />
				</> : <>
					<Stack.Screen name="Login" component={LoginScreen} />
					<Stack.Screen name="Sign Up" component={SignUpScreen} />
				</>}
				{/* Bottom Tab Bar is hidden for the following screens */}
				<Stack.Screen
					name="Edit Diet"
					component={EditDietScreen}
					options={EditDietScreen.navigationOptions}
				/>
			</Stack.Navigator>
		</NavigationContainer>

	);
}