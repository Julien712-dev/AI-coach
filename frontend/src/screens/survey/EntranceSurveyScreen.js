import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Firebase from 'firebase';
import config from '../../config';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Text, Title, Card, Paragraph, TextInput, Chip, Snackbar } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import Carousel from 'react-native-snap-carousel';
import LoadingScreen from "../LoadingScreen";
import { updateTempStorage, saveProfileToFirebase, clearTempStorage } from "../../store/profileSlice.js";
import Swiper from 'react-native-swiper';
import { saveProfileToReducer } from '../../store/authSlice';
import { setPlan } from '../../store/exerciseSlice';

const EXERCISE_SURVEY_BACKGROUND_IMAGE = require('../../../assets/image/survey-background.jpg');

const renderSurveyOptions = (props) => {
    let {
        index,
        setValueFunction,
        displayText,
        currentValue,
        value
    } = props;

    return (
        <TouchableOpacity key={index} style={{marginVertical: 5, padding: 15, width: 325, borderRadius: 15, borderWidth: (currentValue == value) ? 2 : 0.85, borderColor: (currentValue == value)? 'green': 'black', backgroundColor: 'white' }} onPress={() => setValueFunction(value)}>
            <Text>{displayText}</Text>
        </TouchableOpacity>
    )
}

function EntranceSurveyStepOneScreen({ navigation, swiperRef }) {

    let currentProfile = useSelector(state => state.main.auth.profile) || {} ;
    const [firstName, setFirstName] = useState(currentProfile.firstName || null);
    const [lastName, setLastName] = useState(currentProfile.lastName || null);
    const [height, setHeight] = useState(currentProfile.height || null);
    const [heightUnit, setHeightUnit] = useState(currentProfile.heightUnit || 'cm');
    const [weight, setWeight] = useState(currentProfile.weight || null);
    const [weightUnit, setWeightUnit] = useState(currentProfile.weightUnit || 'kg');
    const [age, setAge] = useState(currentProfile.age || null);
    const [sex, setSex] = useState(currentProfile.sex || null);
    const [isValid, setIsValid] = useState(false);
    const [showHeightDropDown, setShowHeightDropDown] = useState(false);
    const [showWeightDropDown, setShowWeightDropDown] = useState(false);
    const [showSexDropDown, setShowSexDropDown] = useState(false);

    const dispatch = useDispatch();
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
                <TextInput style={{
                    width: 165, marginHorizontal: 10, 
                    backgroundColor: 'transparent' }} 
                    label='First Name' 
                    // theme={{ colors: { 
                    //   text: 'white',
                    //   placeholder: 'white',
                    //   primary: 'white',
                    //   underlineColor: 'white'
                    // } }}
                    value={firstName} 
                    onChangeText={text => setFirstName(text)} 
                    autoCorrect={false}></TextInput>
                <TextInput 
                    style={{width: 165, marginHorizontal: 10, backgroundColor: 'transparent'}} 
                    label='Last Name' 
                    value={lastName} 
                    onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View>
            <View style={{ flexDirection: 'row', width: 365, marginBottom: 20 }}>
                <TextInput style={{ width: 220, marginHorizontal: 10, backgroundColor: 'transparent' }} label='Height' value={height} keyboardType={"number-pad"} onChangeText={text => setHeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120}}>
                    <DropDown
                        label={'Height Unit'}
                        mode={'flat'}
                        theme={{ colors: { 
                            background: 'transparent'
                        } }}
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
                <TextInput style={{ width: 220, marginHorizontal: 10, backgroundColor: 'transparent' }} label='Weight' value={weight} keyboardType={"number-pad"} onChangeText={text => setWeight(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120 }}>
                    <DropDown
                        label={'Weight Unit'}
                        mode={'flat'}
                        theme={{ colors: { 
                            background: 'transparent'
                        } }}
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
                <TextInput style={{ width: 220, marginHorizontal: 10, backgroundColor: 'transparent' }} label='Age' value={age} keyboardType={"number-pad"} onChangeText={text => setAge(text)} autoCorrect={false}></TextInput>
                <View style={{ width: 120 }}>
                    <DropDown
                        label={'Gender'}
                        mode={'flat'}
                        theme={{ colors: { 
                            background: 'transparent'
                        } }}
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
                <Button style={{width: 130}} 
                    mode='contained' 
                    disabled={!isValid} 
                    // theme={{ colors: { 
                    //     text: 'black',
                    //     primary: 'black',
                    // } }}
                    onPress={() => {
                    let setObj = {
                        firstName: !!firstName ? firstName: undefined,
                        lastName: !!lastName ? lastName: undefined, 
                        height: !!height ? height: undefined, 
                        weight: !!weight ? weight: undefined,
                        age: !!age ? age: undefined,
                        heightUnit: !!heightUnit ? heightUnit: undefined, 
                        weightUnit: !!weightUnit ? weightUnit: undefined,
                        sex: !!sex? sex: undefined
                    }
                    dispatch(updateTempStorage({...setObj}));
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

    let currentProfile = useSelector(state => state.main.auth.profile) || {} ;
    const [value, setValue] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [exerciseHabit, setExerciseHabit] = useState(currentProfile.exerciseHabit || null);
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
                        dispatch(updateTempStorage({...setObj}));
                        swiperRef.current.scrollBy(1);
                    }}
                >NEXT</Button>
            </View>
        </View>
    )
}

function MultipleChoiceChip({ index, option, selectedElements, setValueFunction }) {

    const [selected, setSelected] = useState(selectedElements.includes(option.value));
    const handleChipSelection = (props) => {
        let {
            item,
            selectedElements,
            setValueFunction
        } = props;

        let newSelectedElements = selectedElements || [];
        if (selectedElements.includes(item.value)) {
            // remove
            // newSelectedElements = newSelectedElements.filter(el => el != item.value);
            setValueFunction(selectedElements.filter(el => el != item.value))
        } else {
            // add
            setValueFunction([...selectedElements, item.value]);
            // newSelectedElements.push(item.value);
        }
        // setValueFunction(newSelectedElements);
    }

    return (
        <Chip 
            key={index}
            mode="flat"
            style={{ marginHorizontal: 3, marginTop: 2, marginBottom: 3 }}
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

    let currentProfile = useSelector(state => state.main.auth.profile) || {} ;

    const [isValid, setIsValid] = useState(false);
    const [alert, setAlert] = useState('');
    const [visible, setVisible] = useState(false);
    const [dietHabit, setDietHabit] = useState(currentProfile.dietHabit || '');
    const [dietRestrictions, setDietRestrictions] = useState(currentProfile.dietRestrictions || []);
    const [foodAllergies, setFoodAllergies] = useState(currentProfile.foodAllergies || []);
    const dispatch = useDispatch();

    let user = useSelector(state => state.main.auth.user);
    let tempProfile = useSelector(state => state.main.profile) || {} ;
    
    const surveyFields = [dietHabit]
    const validateSurvey = () => {
        for (var surveyField of surveyFields) {
            if (!surveyField) return;
        }
        setIsValid(true);
    }

    useEffect(() => {
        validateSurvey();
    }, surveyFields);
 
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 420 }}>
                <View style={{ marginHorizontal: 10 }}>
                    <Title>Step 3: Diet Preferences</Title>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>Body goal</Text> 
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                    {config.constants.dietHabitOptions.map((option, index) => (renderSurveyOptions({index: index, setValueFunction: setDietHabit, displayText: option.label, value: option.value, currentValue: dietHabit})))}
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>Diet Restrictions</Text>
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 5, flexWrap: 'wrap', flexDirection: 'row' }}>
                    {config.constants.dietRestrictions.map((option, index) => <MultipleChoiceChip key={index} index={index} option={option} selectedElements={dietRestrictions} setValueFunction={setDietRestrictions} />)}
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text>Food Allergies</Text>
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 5, flexWrap: 'wrap', flexDirection: 'row' }}>
                    {config.constants.foodAllergies.map((option, index) => <MultipleChoiceChip key={index} index={index} option={option} selectedElements={foodAllergies} setValueFunction={setFoodAllergies} />)}
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
                        const conflictingOptions = ['vegetarian', 'meat'];
                        let setObj = {
                            dietHabit: !!dietHabit ? dietHabit : undefined,
                            dietRestrictions: !!dietRestrictions ? conflictingOptions.every(co => dietRestrictions.includes(co)) ? dietRestrictions.filter(el => !conflictingOptions.includes(el)) : dietRestrictions : undefined,
                            foodAllergies: foodAllergies || undefined,
                        }
                        // dispatch(updateTempStorage({...setObj}));
                        setAlert('Your profile has been updated')
                        setVisible(true);
                        const userFireBaseProfileRef = Firebase.database().ref(`/users/${user.uid}/profile`);
                        userFireBaseProfileRef.set({
                            ...tempProfile,
                            ...setObj
                        });
                        const userFireBaseExercisePlanRef = Firebase.database().ref(`/users/${user.uid}/exercisePlan`);
                        userFireBaseExercisePlanRef.set({
                            ...config.defaultExercisePlan
                        });
                        dispatch(saveProfileToReducer({ profile: { ...tempProfile, ...setObj }}));
                        dispatch(setPlan({ plan: {...config.defaultExercisePlan} }));
                        dispatch(clearTempStorage());
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
    let tempProfile = useSelector(state => state.main.auth.profile);

    const PAGES = [
        <EntranceSurveyStepOneScreen key={`PAGE-0`} navigation={navigation} swiperRef={swiperRef} />, 
        <EntranceSurveyStepTwoScreen key={`PAGE-1`} navigation={navigation} swiperRef={swiperRef} />, 
        <EntranceSurveyStepThreeScreen key={`PAGE-2`} navigation={navigation} swiperRef={swiperRef} />
    ];

    // useEffect(() => {
    //     (async () => {
	// 	  setIsFetched(false);
	// 	  const userDatabaseRef = Firebase.database().ref(`/users/${user.uid}`);
	// 	    userDatabaseRef.once('value', snapshot => { 
	// 		  let value = snapshot.val();
	// 		  if (!!value) {
	// 			setProfile(value);
	// 		  }
	// 		  setIsFetched(true);
	// 	  });
    //     })();
    // }, [])

    // When the user first login, force the user to complete his profile.
	// useEffect(() => {
	// 	const unsubscribe = navigation.addListener('focus', () => {
	// 	  // The screen is focused
	// 	  // Call any action
	// 	  setIsFetched(false);
	// 	  const userDatabaseRef = Firebase.database().ref(`/users/${user.uid}`);
	// 	    userDatabaseRef.once('value', snapshot => { 
	// 		  let value = snapshot.val();
	// 		  if (!!value) {
	// 			setProfile(value);
	// 		  }
	// 		  setIsFetched(true);
	// 	  });
	// 	});
	
	// 	// Return the function to unsubscribe from the event so it gets removed on unmount
	// 	return unsubscribe;
	//   }, [navigation]);

    if (!user) {
        return (<LoadingScreen />)
    } else {
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {/* <View style={{flex: 1}}> */}
            <View style={styles.backgroundContainer}>
                <ImageBackground 
                source={EXERCISE_SURVEY_BACKGROUND_IMAGE} 
                style={styles.bakcgroundImage}
                blurRadius={10}
                >
                </ImageBackground>
            </View>
            {tempProfile &&             
            <Button 
                icon="close" 
                style={{ position: 'absolute', top:20, right:0, color: 'white' }}
                // theme={{ colors: { 
                //   text: 'black',
                //   primary: 'black',
                // } }}
                onPress={() => navigation.goBack()}>CLOSE
            </Button>}
            <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>Set up your profile for a better user experience! </Text>
            </View>
            <Swiper
                ref={swiperRef}
                style={{ height: 530 }}
                // activeDotColor={'black'}
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

const styles = StyleSheet.create({
    inputStyle: {
        flex: 1,
        marginHorizontal: 10
    },
    btnStyle: {
        margin: 10,
        alignSelf: "center"
    },
    backgroundContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    bakcgroundImage: {
        flex: 1, 
        width: null, 
        height: null,
        opacity: 0.2
    },
})