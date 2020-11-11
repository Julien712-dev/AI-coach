import * as React from 'react';
import firebase from 'firebase';
import { Text, View, StyleSheet } from 'react-native';
import { FAB, Portal, Provider, Card, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import react from 'react';

const LoginScreen = (props) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = react.useState('')
  const [loading, setLoading] = React.useState(false)

  const registerButtonPress = () => {
    setError('')
    setLoading(true)
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(setLoading(false))
      .catch(() => {
        setError('Registration Failed')
      })
  }

  const loginButtonPress = () => {
    setError('')
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(setLoading(false))
      .catch(() => {
        setError('Login Failed')
      })
  }

  
  return (
    <View>
      <Card style={{ margin: 10 }}>
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
          <Button style={styles.btnStyle} mode="contained" onPress={() => {registerButtonPress()}}>
          Register
          </Button>

          <Button style={styles.btnStyle} mode="contained" onPress={() => loginButtonPress()}>
          Log In
          </Button>
        </View>

        {loading ? <ActivityIndicator animating={true} /> : <Text style={styles.errorTextStyle}>{error}</Text>}

			  </Card.Content>
		  </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  btnStyle:{
    margin: 10,
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