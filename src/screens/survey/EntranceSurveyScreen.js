import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Firebase from 'firebase';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Text, Title, Card, Paragraph, TextInput } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import LoadingScreen from "../LoadingScreen";

export default function EntranceSurveyScreen({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profile, setProfile] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const dispatch = useDispatch();

    let user = useSelector(state => state.main.auth.user) || {};

    // When the user first login, force the user to complete his profile.
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  // Call any action
		  setIsFetched(false);
		  const userDatabaseRef = Firebase.database().ref(`/users/${user.uid}`);
		  userDatabaseRef.on('value', snapshot => { 
			  let value = snapshot.val();
			  if (!!value) {
				setProfile(value);
			  }
			  setIsFetched(true);
		  });
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	  }, [navigation]);

    const createProfile = () => {
        const profileRef = Firebase.database().ref(`users/${user.uid}`);
        profileRef.set({
            ...profile, 
            profile: {
            firstName: firstName, 
            lastName: lastName
        }}).then(() => {
            navigation.goBack();
        });
    };

    if (!user || !isFetched) {
        return (<LoadingScreen />)
    } else {
    return (
        <ScrollView>
            <View style={{flex: 1}}>
            {/* <Title>{JSON.stringify(user)}</Title> */}
            {/* {!!reduxProfile ? <Text>{JSON.stringify(reduxProfile)}</Text>:<Text>No</Text>} */}
            <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>
                <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', flex: 1 }}>
                    <Text>Set up your profile for a better user experience! </Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <TextInput style={styles.inputStyle} label='First Name' mode='outlined' value={firstName} onChangeText={text => setFirstName(text)} autoCorrect={false}></TextInput>
                <TextInput style={styles.inputStyle} label='Last Name' mode='outlined' value={lastName} onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View>
            <Button style={styles.btnStyle} mode='contained' onPress={() => createProfile()}>create profile</Button>
        </ScrollView>
    )
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        flex: 1,
        marginHorizontal: 10
    },
    btnStyle: {
        margin: 10,
        alignSelf: "center"
    }
})