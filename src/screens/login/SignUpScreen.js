import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import { Title, Card, TextInput, Button, ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { login } from '../../store/authSlice';


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

  const onDismissSnackBar = () => setVisible(false)

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
        <View style={styles.backgroundContainer}>
            <ImageBackground 
              source={require('../../../assets/image/female-athlete.jpg')} 
              style={styles.bakcgroundImage}
              blurRadius={70}
            >
            </ImageBackground>
        </View>

        <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>

        <View>
          <Card style={{ marginHorizontal: 10, width: 350, opacity: 0.9, backgroundColor: 'transparent' }}>
            <View style={{ marginLeft: 15, marginTop: 10, alignSelf: "flex-start"  }}>
              <Title style={{ fontSize: 28 }}>Sign Up to Coach.ai</Title>
              <Text>Enjoy an intelligent fitness journey.</Text>
            </View>
            <Card.Content>
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
              <View style={{flexDirection: 'row', alignItems: 'stretch', marginTop: 10}}>
                <Button style={styles.btnStyle} mode="contained" onPress={() => registerButtonPress()}>
                Register
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>

          {loading ? <ActivityIndicator animating={true} /> : <ActivityIndicator animating={false} /> }
          
        <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={3000}>{alert}</Snackbar>
      </View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
      opacity: 0.5
    },
    btnStyle:{
      marginHorizontal: 10,
      flex: 1,
      width: 250,
      borderRadius: 20
    },
    textInputStyle:{
      margin: 10,
      width: 300,
      backgroundColor: "transparent"
    },
    errorTextStyle:{
      fontSize: 20,
      alignSelf: 'center',
      color:'red'
    }
  })