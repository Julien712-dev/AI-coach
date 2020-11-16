import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Searchbar, Button, Divider, TextInput, FAB, Portal, Provider } from 'react-native-paper';
import LoadingScreen from '../LoadingScreen';
import Firebase from 'firebase';
import DropDown from 'react-native-paper-dropdown';

export default function LogDietDetailsScreen({navigation}) {

    let meals = [
        {label: 'Breakfast', value: 'breakfast'}, 
        {label: 'Lunch', value: 'lunch'}, 
        {label: 'Snack', value: 'snack'}, 
        {label: 'Dinner',value: 'dinner'}
    ];
    const [user, setUser] = useState(null);
    const [initialUser, setInitialUser] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [mealSelected, setMealSelected] = useState();
    const [itemName, setItemName] = useState('');
    const [calorieAmount, setCalorieAmount] = useState('');

    const onSaveChanges = () => {
        setDialogVisible(false);
        userDatabaseRef.set(user);
        navigation.dispatch(navigationAction);
    };

    // const userId = '1234567890';

    // const userDatabaseRef = Firebase.database().ref(`/users/${userId}`);

    // useEffect(() => {
    //     userDatabaseRef.on('value', snapshot => { 
    //         let value = snapshot.val();
    //         setInitialUser(value);
    //         setUser(value); 
    //     });
    // }, []);
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('beforeRemove', event => {
    //         if (JSON.stringify(user) != JSON.stringify(initialUser)) {
    //             event.preventDefault();
    //             setNavigationAction(event.data.action);
    //             setDialogVisible(true);
    //         }
    //     });
    //     return unsubscribe;
    // }, [navigation, user, initialUser]);

    return (
		<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{padding: 20}}>
                <DropDown
                    label={'Select Meal'}
                    mode={'outlined'}
                    value={mealSelected}
                    setValue={setMealSelected}
                    list={meals}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    inputProps={{
                        right: <TextInput.Icon name={'menu-down'} />,
                    }}
                />
                <TextInput
                    style={{ marginVertical: 15 }}
                    label="Food Item Name"
                    value={itemName}
                    onChangeText={item => setItemName(item)}
                />
                <TextInput
                    style={{ marginVertical: 10 }}
                    label="Amount of Calories"
                    value={calorieAmount}
                    onChangeText={item => setCalorieAmount(item)}
                />
			</ScrollView>
            <Provider>
                <Portal>
                    <FAB 
                        small 
                        style={{position: "absolute", alignSelf: 'flex-end', margin: 16, right: 0, bottom: 0}} 
                        icon={`check`} 
                        label={`Confirm`} 
                    />
                </Portal>
            </Provider>
		</View>
    )
}