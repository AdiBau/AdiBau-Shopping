import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import errorSend from '../errorSend/errorSend'
const Login = ({ setViews, setMassage }) => {
  const [login, setlogin] = useState({ login: '', password: '' })
  const [spinner, setSpinner] = useState(false)

  const loginSend = async () => {
    setSpinner(true)
    const data = { login: login.login, password: login.password }

    await fetch('https://biuro.adibau.pl/birthday/login', {
   // await fetch('http://192.168.1.123:8080/birthday/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setViews({ login: false, home: true })
        } else {
          setMassage('Błędny login lub password')
          setSpinner(false)
        }
      })
      .catch((err) => {
        setMassage('Sorry please try again later')
        errorSend({ from: 'Login', status: err.status, error: err.massage })
        setSpinner(false)
      })
    setlogin({})
  }
  const registerVisible = () => {
    setViews({ login: false, home: false, register: true })
  }

  return (
    <>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/adibauBirthdayReminder.png')} />
        <StatusBar style='auto' backgroundColor={styles.container.backgroundColor} />
        <View style={styles.inputView}>
          <TextInput style={styles.TextInput} placeholder='Login' placeholderTextColor='#003f5c' value={login.login} onChangeText={(login) => setlogin({ ...login, login })} maxLength={15} />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder='Password'
            placeholderTextColor='#003f5c'
            secureTextEntry={true}
            onChangeText={(password) => setlogin({ ...login, password })}
            value={login.password}
            keyboardType={'decimal-pad'}
            maxLength={15}
          />
        </View>
        <TouchableOpacity onPress={registerVisible}>
          <Text style={styles.new_account}>New Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={loginSend}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <Spinner visible={spinner} textContent={'Loading ........ '} textStyle={styles.spinnerTextStyle} animation={'slide'} overlayColor='rgba(0,0,0,0.6)' size={'large'} />
    </>
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#29a6dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'center',
  },
  inputView: {
    backgroundColor: '#dddddd',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  new_account: {
    height: 30,
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255)',
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: 'lightgreen',
  },
})

export default Login
