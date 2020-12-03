import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Firebase from 'firebase';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Text, Title, Card, Paragraph, TextInput } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import Carousel from 'react-native-snap-carousel';
import LoadingScreen from "../LoadingScreen";
import { saveProfile, updateProfile } from "../../actions/profile.actions";
import { updateTempStorage } from "../../store/profileSlice.js";

import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';

function EntranceSurveyStepOneScreen({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [showHeightDropDown, setShowHeightDropDown] = useState(false);
    const [showWeightDropDown, setShowWeightDropDown] = useState(false);
    const [sex, setSex] = useState('M');

    const dispatch = useDispatch();

    const onSexToggle = value => {
        setSex(status === 'M' ? 'F' : 'M');
    };
    
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
                <TextInput style={styles.inputStyle} label='First Name' mode='outlined' value={firstName} onChangeText={text => setFirstName(text)} autoCorrect={false}></TextInput>
                <TextInput style={styles.inputStyle} label='Last Name' mode='outlined' value={lastName} onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View>
            <View style={{ flexDirection: 'row', width: 365 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10 }} label='Height' mode='outlined' value={height} keyboardType={"number-pad"} onChangeText={text => setHeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120}}>
                    <DropDown
                        mode={'outlined'}
                        value={heightUnit}
                        setValue={setHeightUnit}
                        list={config.constants.heightUnits}
                        visible={showHeightDropDown}
                        showDropDown={() => setShowHeightDropDown(true)}
                        onDismiss={() => setShowHeightDropDown(false)}
                        inputProps={{
                            right: <TextInput.Icon name={'menu-down'} />,
                        }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", width: 365 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10 }} label='Weight' mode='outlined' value={weight} keyboardType={"number-pad"} onChangeText={text => setWeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120 }}>
                    <DropDown
                        mode={'outlined'}
                        value={weightUnit}
                        setValue={setWeightUnit}
                        list={config.constants.weightUnits}
                        visible={showWeightDropDown}
                        showDropDown={() => setShowWeightDropDown(true)}
                        onDismiss={() => setShowWeightDropDown(false)}
                        inputProps={{
                            right: <TextInput.Icon name={'menu-down'} />,
                        }}
                    />
                </View>
            </View>
            {/* <Button style={styles.btnStyle} mode='contained' onPress={() => {dispatch(updateProfile({ newData: { 
                firstName: firstName, 
                lastName: lastName, 
                height: height, 
                weight: weight, 
                heightUnit: heightUnit, 
                weightUnit: weightUnit,
                sex: sex
            }}))}}>update dispatch</Button> */}
            {/* <Button style={styles.btnStyle} mode='contained' onPress={() => createProfile()}>create profile</Button> */}
            <Button style={styles.btnStyle} mode='contained' onPress={() => {
                dispatch(updateTempStorage(
                    { 
                        firstName: firstName, 
                        lastName: lastName, 
                        height: height, 
                        weight: weight, 
                        heightUnit: heightUnit, 
                        weightUnit: weightUnit,
                        sex: sex
                    }
                ));

                // dispatch(saveProfile());
                // navigation.goBack();
                }}>create profile</Button>
        </View>
    )
}

function EntranceSurveyStepTwoScreen({ navigation }) {
    return (
        <View>
            <Text>Step Two</Text>
        </View>
    )
}

function EntranceSurveyStepThreeScreen({ navigation }) {

    
    return (
        <View>
            <Text>Step Three</Text>
        </View>
    )
}

// MAIN
export default function EntranceSurveyScreen({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profile, setProfile] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();

    const swiperRef = useRef(null);

    let user = useSelector(state => state.main.auth.user) || {};
    let tempProfile = useSelector(state => state.main.profile);

    const PAGES = [
        <EntranceSurveyStepOneScreen navigation={navigation} />, 
        <EntranceSurveyStepTwoScreen navigation={navigation} />, 
        <EntranceSurveyStepThreeScreen navigation={navigation} />
    ];


    const onStepPress = (position) => {
        setCurrentPage(position);
    };

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
            {/* <Text>{user.uid}</Text> */}
            <Text>{JSON.stringify(tempProfile)}</Text>
            <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>
                <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', flex: 1 }}>
                    <Text>Set up your profile for a better user experience! </Text>
                </View>
            </View>
            {/* <View style={{ flex: 1, flexDirection: "row" }}>
                <TextInput style={styles.inputStyle} label='First Name' mode='outlined' value={firstName} onChangeText={text => setFirstName(text)} autoCorrect={false}></TextInput>
                <TextInput style={styles.inputStyle} label='Last Name' mode='outlined' value={lastName} onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View> */}
            {/* <Button style={styles.btnStyle} mode='contained' onPress={() => {dispatch(updateProfile({ newData: { firstName: firstName, lastName: lastName }}))}}>update dispatch</Button>
            <Button style={styles.btnStyle} mode='contained' onPress={() => createProfile()}>create profile</Button>
            <Button style={styles.btnStyle} mode='contained' onPress={() => {dispatch(saveProfile())}}>create profile</Button>
            <Button style={styles.btnStyle} mode='contained' disabled={currentPage >= PAGES.length-1} onPress={() => swiperRef.current.scrollBy(1)}>Next Page</Button>
            <Button style={styles.btnStyle} mode='contained' disabled={currentPage == 0} onPress={() => swiperRef.current.scrollBy(-1)}>Go Back</Button> */}
            <Swiper
                ref={swiperRef}
                style={{ height: 460 }}
                loop={false}
                index={currentPage}
                autoplay={false}
                showsButtons={false}
                scrollEnabled={false}
                onIndexChanged={(page) => {
                setCurrentPage(page);
                }}
            >
                {PAGES.map((page) => (page))}
            </Swiper>

            <Button style={styles.btnStyle} mode='contained' disabled={currentPage >= PAGES.length-1} onPress={() => swiperRef.current.scrollBy(1)}>Next Page</Button>
            <Button style={styles.btnStyle} mode='contained' disabled={currentPage == 0} onPress={() => swiperRef.current.scrollBy(-1)}>Go Back</Button>
        </ScrollView>
    )
    }
}

const thirdIndicatorStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#7eaec4',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#7eaec4',
    stepStrokeUnFinishedColor: '#dedede',
    separatorFinishedColor: '#7eaec4',
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: '#7eaec4',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#7eaec4',
  };

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