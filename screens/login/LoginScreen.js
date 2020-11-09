import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, Provider, Card, TextInput, Button } from 'react-native-paper';

const LoginScreen = (props) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <View>
      <Text>Login Screen testing</Text>

      <Card style={{ width: '100%', marginTop: 10 }}>
			  <Card.Content>
        <TextInput
          label="Email"
          value={email}
          onChangeText={email => setEmail(email)}
        />

        <TextInput
          label="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={password => setPassword(password)}
        />

        <Button mode="contained" onPress={() => console.log('Register Pressed')}>
        Register
        </Button>

        <Button mode="contained" onPress={() => console.log('Log in Pressed')}>
        Log In
        </Button>

			  </Card.Content>
		  </Card>

    </View>
  )
}

const styles = StyleSheet.create({

})

export default LoginScreen;