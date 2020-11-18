import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FAB, Portal, Provider, Card, TextInput, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import react from 'react';
import { loginFunc } from '../../actions/auth.actions';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
	let user = useSelector(state => state.main.uiReducer.user);

  const registerButtonPress = () => {
    // setLoading(true)
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //   .then(() => { 
    //     setLoading(false); 
    //     setAlert('Registration Succeeded!'); 
    //     setVisible(true); })
    //   .catch(() => {
    //     setLoading(false)
    //     setAlert('Registration Failed')
    //     setVisible(true)
    //   })
    navigation.navigate('Sign Up');
  }

  const loginButtonPress = () => {
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(loginFunc());
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
        dispatch(loginFunc());
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
      <Card style={{ margin: 10, width: 350 }}>
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

        <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
          <Button style={styles.btnStyle} mode="contained" onPress={() => registerButtonPress()}>
          Register
          </Button>

          <Button style={styles.btnStyle} mode="contained" onPress={() => loginButtonPress()}>
          Log In
          </Button>
        </View>

        {loading ? <ActivityIndicator animating={true} /> : <ActivityIndicator animating={false} /> }

        <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
          <Button style={styles.btnStyle} mode="contained" onPress={() => loginAsTrialUser()}>
            Trial User
          </Button>
        </View>
			  </Card.Content>
		  </Card>


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
    // backgroundColor: 'white'
  },
  btnStyle:{
    marginHorizontal: 10,
    flex: 1
  },
  textInputStyle:{
    margin: 10
  },
  errorTextStyle:{
    fontSize: 20,
    alignSelf: 'center',
    color:'red'
  }
})

export default LoginScreen;