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
    const [calorieAmount, setCalorieAmount] = useState(0);
    const [proteinAmount, setProteinAmount] = useState(0);
    const [fatAmount, setFatAmount] = useState(0);
    const [carbAmount, setCarbAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [loggedItems, setLoggedItems] = useState([]);

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
                <View style={{ marginTop: 10 }}>
                    <Text>About the item</Text>
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        label="Food Item Name"
                        value={itemName}
                        onChangeText={item => setItemName(item)}
                    />
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        label="Description (Optional)"
                        value={description}
                        onChangeText={item => setDescription(item)}
                    />
                </View>
                <View style={{ marginVertical: 10}}>
                    <Text>Nutrients</Text>
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        keyboardType={"number-pad"}
                        label="Calories (in KCals)"
                        value={calorieAmount}
                        onChangeText={item => setCalorieAmount(item)}
                    />
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        keyboardType={"number-pad"}
                        label="Proteins (in grams)"
                        value={proteinAmount}
                        onChangeText={item => setProteinAmount(item)}
                    />
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        keyboardType={"number-pad"}
                        label="Carbs (in grams)"
                        value={carbAmount}
                        onChangeText={item => setCarbAmount(item)}
                    />
                    <TextInput
                        style={{ marginTop: 5, backgroundColor: 'transparent' }}
                        keyboardType={"number-pad"}
                        label="Fats (in grams)"
                        value={fatAmount}
                        onChangeText={item => setFatAmount(item)}
                    />
                </View>
                <Button icon='check' mode='contained'>ADD</Button>
			</ScrollView>
            <Provider>
                <Portal>
                    <FAB 
                        small 
                        style={{position: "absolute", alignSelf: 'flex-end', margin: 16, right: 0, bottom: 0}} 
                        icon={`plus`} 
                        label={`Log ${!!loggedItems.length? `(1 added)` : ``}`} 
                    />
                </Portal>
            </Provider>
            <View style={{ marginBottom: 50 }}></View>
		</View>
    )
}