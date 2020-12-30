import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Firebase from 'firebase';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button, Text, Title, Card, Paragraph, TextInput, Chip, RadioButton, Snackbar } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import Carousel from 'react-native-snap-carousel';
import LoadingScreen from "../LoadingScreen";
import { updateTempStorage, saveProfileToFirebase } from "../../store/profileSlice.js";
import Swiper from 'react-native-swiper';

const renderSurveyOptions = (props) => {
    let {
        index,
        setValueFunction,
        displayText,
        currentValue,
        value
    } = props;

    return (
        <TouchableOpacity key={index} style={{marginVertical: 5, padding: 15, width: 325, borderRadius: 15, borderWidth: (currentValue == value) ? 2 : 0.85, borderColor: (currentValue == value)? 'green': 'black' }} onPress={() => setValueFunction(value)}>
            <Text>{displayText}</Text>
        </TouchableOpacity>
    )
}

function EntranceSurveyStepOneScreen({ navigation, swiperRef }) {

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [height, setHeight] = useState(null);
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weight, setWeight] = useState(null);
    const [weightUnit, setWeightUnit] = useState('kg');
    const [age, setAge] = useState(null);
    const [sex, setSex] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [showHeightDropDown, setShowHeightDropDown] = useState(false);
    const [showWeightDropDown, setShowWeightDropDown] = useState(false);
    const [showSexDropDown, setShowSexDropDown] = useState(false);

    const dispatch = useDispatch();

	let user = useSelector(state => state.main.auth.user);
    const surveyFields = [firstName, lastName, height, weight, age, sex];

    const validateSurvey = () => {
        for (var surveyField of surveyFields) {
            if (!surveyField) return;
        }
        setIsValid(true);
    }

    useEffect(() => {
        validateSurvey();
    }, surveyFields)
    
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 400}}>
            <View style={{ marginHorizontal: 10 }}>
                <Title>Step 1: About You</Title>
            </View>
            <View style={{ flexDirection: "row", width: 365, marginBottom: 20 }}>
                <TextInput style={{width: 165, marginHorizontal: 10}} label='First Name' mode='outlined' value={firstName} onChangeText={text => setFirstName(text)} autoCorrect={false}></TextInput>
                <TextInput style={{width: 165, marginHorizontal: 10}} label='Last Name' mode='outlined' value={lastName} onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View>
            <View style={{ flexDirection: 'row', width: 365, marginBottom: 20 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10 }} label='Height' mode='outlined' value={height} keyboardType={"number-pad"} onChangeText={text => setHeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120}}>
                    <DropDown
                        label={'Height Unit'}
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
            <View style={{ flexDirection: "row", width: 365, marginBottom: 20 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10 }} label='Weight' mode='outlined' value={weight} keyboardType={"number-pad"} onChangeText={text => setWeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120 }}>
                    <DropDown
                        label={'Weight Unit'}
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
            <View style={{ flexDirection: "row", width: 365, marginBottom: 20 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10 }} label='Age' mode='outlined' value={age} keyboardType={"number-pad"} onChangeText={text => setAge(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120 }}>
                    <DropDown
                        label={'Gender'}
                        mode={'outlined'}
                        value={sex}
                        setValue={setSex}
                        list={config.constants.genderValues}
                        visible={showSexDropDown}
                        showDropDown={() => setShowSexDropDown(true)}
                        onDismiss={() => setShowSexDropDown(false)}
                        inputProps={{
                            right: <TextInput.Icon name={'menu-down'} />,
                        }}
                    />
                </View>
            </View>
            </View>
            <View style={{ marginHorizontal: 10, flexDirection: "row", alignContent: "center", justifyContent: "center" }}>
                <Button style={{width: 130}} mode='contained' disabled={!isValid} onPress={() => {
                    let setObj = {
                        firstName: !!firstName ? firstName: undefined,
                        lastName: !!lastName ? lastName: undefined, 
                        height: !!height ? height: undefined, 
                        weight: !!weight ? weight: undefined, 
                        heightUnit: !!heightUnit ? heightUnit: undefined, 
                        weightUnit: !!weightUnit ? weightUnit: undefined,
                        sex: !!sex? sex: undefined
                    }
                    dispatch(updateTempStorage(setObj));
                    // const userFireBaseProfileRef = Firebase.database().ref(`/users/${user.uid}/profile`);
                    // dispatch(saveProfileToFirebase(userFireBaseProfileRef));
                    swiperRef.current.scrollBy(1)
                    }}>NEXT</Button>
            </View>
        </View>
    )
}

function renderChipOfSingleChoice() {
    return (<Chip></Chip>)
}


function EntranceSurveyStepTwoScreen({ navigation, swiperRef }) {

    const [value, setValue] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [exerciseHabit, setExerciseHabit] = useState(null);
    const [isValid, setIsValid] = useState(false);

    const dispatch = useDispatch();
    
    const surveyFields = [exerciseHabit]
    const validateSurvey = () => {
        for (var surveyField of surveyFields) {
            if (!surveyField) return;
        }
        setIsValid(true);
    }

    useEffect(() => {
        validateSurvey();
    }, surveyFields)

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 400}}>
                <View style={{ marginHorizontal: 10 }}>
                    <Title>Step 2: Exercise Habits</Title>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>How often do you exercise weekly?</Text> 
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    {config.constants.exerciseHabitOptions.map((option, index) => (renderSurveyOptions({index: index, setValueFunction: setExerciseHabit, displayText: option.label, value: option.value, currentValue: exerciseHabit})))}
                </View>
            </View>

            <View style={{ marginHorizontal: 10, flexDirection: "row", alignContent: "center", justifyContent: "center" }}>
                <Button 
                    style={{marginHorizontal: 5, width: 130}} 
                    mode="contained"
                    onPress={() => swiperRef.current.scrollBy(-1)}
                
                >PREVIOUS</Button>
                <Button 
                    disabled={!isValid} 
                    style={{ marginHorizontal: 5, width: 130 }} 
                    mode="contained"
                    onPress={() => {
                        let setObj = {
                            exerciseHabit: !!exerciseHabit ? exerciseHabit : undefined
                        }
                        dispatch(updateTempStorage(setObj));
                        swiperRef.current.scrollBy(1);
                    }}
                >NEXT</Button>
            </View>
        </View>
    )
}

function MultipleChoiceChip({ index, option, selectedElements, setValueFunction }) {

    const [selected, setSelected] = useState(false);
    const handleChipSelection = (props) => {
        let {
            item,
            selectedElements,
            setValueFunction
        } = props;

        let newSelectedElements = selectedElements || [];
        if (selectedElements.includes(item.value)) {
            // remove
            newSelectedElements = newSelectedElements.filter(el => el != item.value);
        } else {
            // add
            newSelectedElements.push(item.value);
        }
        console.log(newSelectedElements);
        setValueFunction(newSelectedElements);
    }

    return (
        <Chip 
            key={index}
            mode="flat"
            style={{ marginHorizontal: 3, marginVertical: 5 }}
            onPress={() => {
                setSelected(selected => !selected); 
                handleChipSelection({ item: option, selectedElements, setValueFunction})}} 
            selected={selected}
            >
                {option.label}
        </Chip>
    )
}

function EntranceSurveyStepThreeScreen({ navigation, swiperRef }) {

    const [isValid, setIsValid] = useState(false);
    const [alert, setAlert] = useState('');
    const [visible, setVisible] = useState(false);
    const [dietHabit, setDietHabit] = useState('');
    const [dietRestrictions, setDietRestrictions] = useState([]);
    const [foodAllergies, setFoodAllergies] = useState([]);
    const dispatch = useDispatch();

    let user = useSelector(state => state.main.auth.user);
    
    const surveyFields = [dietHabit]
    const validateSurvey = () => {
        for (var surveyField of surveyFields) {
            if (!surveyField) return;
        }
        setIsValid(true);
    }

    useEffect(() => {
        validateSurvey();
    }, surveyFields)

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 400}}>
                <View style={{ marginHorizontal: 10 }}>
                    <Title>Step 3: Diet Preferences</Title>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>What are the body goals you would like to achieve?</Text> 
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 15 }}>
                    {config.constants.dietHabitOptions.map((option, index) => (renderSurveyOptions({index: index, setValueFunction: setDietHabit, displayText: option.label, value: option.value, currentValue: dietHabit})))}
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>Do you have any diet restrictions?</Text>
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 15, flexWrap: 1, flex: 1, flexDirection: 'row' }}>
                    {/* {config.constants.dietRestrictions.map((option, index) => <Chip key={index} onPress={() => handleChipSelection({ item: option, selectedElements: dietRestrictions, setValueFunction: setDietRestrictions})} selected={dietRestrictions.includes(option)}>{option.label}</Chip>)} */}
                    {config.constants.dietRestrictions.map((option, index) => <MultipleChoiceChip index={index} option={option} selectedElements={dietRestrictions} setValueFunction={setDietRestrictions} />)}
                </View>

            </View>
            <View style={{ marginHorizontal: 10, flexDirection: "row", alignContent: "center", justifyContent: "center" }}>
                <Button 
                    style={{marginHorizontal: 5, width: 130}} 
                    mode="contained"
                    onPress={() => swiperRef.current.scrollBy(-1)}
                
                >PREVIOUS</Button>
                <Button
                    disabled={!isValid}
                    style={{ marginHorizontal: 5, width: 130 }} 
                    mode="contained"
                    onPress={() => {
                        let setObj = {
                            dietHabit: !!dietHabit ? dietHabit : undefined,
                            dietRestrictions: !!dietRestrictions ? dietRestrictions : undefined,
                        }
                        dispatch(updateTempStorage(setObj));
                        setAlert('Your profile has been updated')
                        setVisible(true);
                        const userFireBaseProfileRef = Firebase.database().ref(`/users/${user.uid}/profile`);
                        dispatch(saveProfileToFirebase(userFireBaseProfileRef));
                        setTimeout(() => {
                            navigation.goBack();
                        }, 1000)
                    }}
                >SAVE</Button>
            </View>
            <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={3000}>{alert}</Snackbar>
        </View>
    )
}

// MAIN
export default function EntranceSurveyScreen({ navigation }) {

    const [profile, setProfile] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();

    const swiperRef = useRef(null);

    let user = useSelector(state => state.main.auth.user) || {};
    let tempProfile = useSelector(state => state.main.profile);

    const PAGES = [
        <EntranceSurveyStepOneScreen key={`PAGE-0`} navigation={navigation} swiperRef={swiperRef} />, 
        <EntranceSurveyStepTwoScreen key={`PAGE-1`} navigation={navigation} swiperRef={swiperRef} />, 
        <EntranceSurveyStepThreeScreen key={`PAGE-2`} navigation={navigation} swiperRef={swiperRef} />
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

    if (!user || !isFetched) {
        return (<LoadingScreen />)
    } else {
    return (
        <ScrollView>
            <View style={{flex: 1}}>
            {/* <Text>{JSON.stringify(tempProfile)}</Text> */}
            <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>
                <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', flex: 1 }}>
                    <Text>Set up your profile for a better user experience! </Text>
                </View>
            </View>
            <Swiper
                ref={swiperRef}
                style={{ height: 500 }}
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