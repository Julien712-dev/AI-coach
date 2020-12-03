import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Title, Card, TextInput, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import react from 'react';
import { login } from '../../store/authSlice';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback 
    onPress={() => Keyboard.dismiss()}> {children}
    </TouchableWithoutFeedback>
);


export default function SignUpScreen({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [alert, setAlert] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();

  const registerButtonPress = () => {
    setLoading(true)
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => { 
        setLoading(false); 
        setAlert('Registration Succeeded!'); 
        setVisible(true);
        navigation.navigate('Login');
    })
      .catch(() => {
        setLoading(false);
        if (!email || !password) {
            setAlert('Registration Failed. Please fill in your email/password.');
        } else {
            setAlert('Registration Failed.');
        }
        setVisible(true);
      });
    // navigation.navigate('Sign Up');
  }

  const loginButtonPress = () => {
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(login());
        loginSuccess();
      })
      .catch(() => {
        setLoading(false)
        setAlert('Login Failed')
        setVisible(true)
      })
  }

  const loginSuccess = () => {
    console.log('login success')
    setAlert('login Successful!!')
    setVisible(true)
    setTimeout(() => {
      navigation.navigate('Home')
    }, 1000)
  };

  const loginAsTrialUser = () => {
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(`trial@gmail.com`, `123456`)
      .then(() => {
        dispatch(login());
        loginSuccess();
      })
      .catch(() => {
        setLoading(false)
        setAlert('Login Failed')
        setVisible(true)
      })
  }

  const onDismissSnackBar = () => setVisible(false)

    return (
        <View style={styles.container}>
        <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>
        <Title>Sign up to use our functions!</Title>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
            <TextInput
                style={styles.textInputStyle}
                label="Email"
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                keyboardType='email-address'
                value={email}
                onChangeText={email => setEmail(email)}
            />

            <TextInput
                    style={styles.textInputStyle}
                    label="Password"
                    autoCapitalize='none'
                    autoCorrect={false}
                    autoCompleteType='password'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={password => setPassword(password)}
            />
            </View>
        </TouchableWithoutFeedback>

  
          <View style={{flexDirection: 'row', alignItems: 'stretch', marginTop: 10}}>
            <Button style={styles.btnStyle} mode="contained" onPress={() => registerButtonPress()}>
            Register
            </Button>
  
            {/* <Button style={styles.btnStyle} mode="contained" onPress={() => loginButtonPress()}>
            Log In
            </Button> */}
          </View>
  
          {loading ? <ActivityIndicator animating={true} /> : <ActivityIndicator animating={false} /> }
  
          {/* <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
            <Button style={styles.btnStyle} mode="contained" onPress={() => loginAsTrialUser()}>
              Trial User
            </Button>
          </View> */}
  
        <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={3000}>{alert}</Snackbar>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    btnStyle:{
      marginHorizontal: 10,
    //   flex: 1,
      width: 250
    },
    textInputStyle:{
      margin: 10,
      width: 300
    },
    errorTextStyle:{
      fontSize: 20,
      alignSelf: 'center',
      color:'red'
    }
  })