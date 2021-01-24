import React from 'react'
import firebase from 'firebase'

export function onSignUp(params) {
  const { email, password, name } = params
  firebase.auth().createUserWithEmailAndPassword
}


export default Register