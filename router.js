import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importing Screens
import HomeScreen from "./screens/HomeScreen"
import DietScreenMain from "./screens/DietScreenMain"
import SettingsScreen from "./screens/ExerciseScreenMain"
import DetailsScreen from "./screens/DetailsScreen"

// Stacks
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const DietStack = createStackNavigator();

function DietStackScreen() {
    return (
        <DietStack.Navigator>
            <DietStack.Screen name="Diet Main" component={DietScreenMain} />
            <DietStack.Screen name="Details" component={DetailsScreen} />
        </DietStack.Navigator>
    )
}

const ExerciseStack = createStackNavigator();

function ExerciseStackScreen() {
  return (
    <ExerciseStack.Navigator>
      <ExerciseStack.Screen name="Exercise Main" component={SettingsScreen} />
      <ExerciseStack.Screen name="Details" component={DetailsScreen} />
    </ExerciseStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function Routers() {
  return (
    <NavigationContainer>
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
      
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
              }}
        >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Diet" component={DietStackScreen} />
        <Tab.Screen name="Exercise" component={ExerciseStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}