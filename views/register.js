import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Massage from '../components/massage'
import errorSend from '../errorSend/errorSend'

const Register = ({ setViews }) => {
  const [login, setlogin] = useState('')
  const [password, setPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [massage, setMassage] = useState('')

  const loginSend = async () => {
    const data = { login: login, password: password }

    await fetch('https://biuro.adibau.pl/birthday/register', {
      // await fetch('http://192.168.1.123:8080/birthday/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setViews({ login: true, home: false, register: false })
          setMassage('you are registered, please login yet')
          setSpinner(false)
        }
        if (data.status === 400) {
          setMassage('Please enter another login')
          setSpinner(false)
        }
        console.log(data.status)
      })
      .catch((err) => {
        setMassage('Sorry please try again later')
        errorSend({ from: 'Register', status: err.status, error: err.massage })
        setSpinner(false)
      })
    setlogin('')
    setPassword('')
  }

  const registerVisible = () => {
    setViews({ login: true, home: false, register: false })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/adibauBirthdayReminder.png')} />
      <StatusBar style='dark' backgroundColor={styles.container.backgroundColor} />
      <View style={styles.inputView}>
        <TextInput style={styles.TextInput} placeholder='New Login' placeholderTextColor='#003f5c' value={login} onChangeText={(text) => setlogin(text)} maxLength={15} keyboardType='default' />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='New PIN Number'
          placeholderTextColor='#003f5c'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          value={password}
          keyboardType={'decimal-pad'}
          maxLength={15}
        />
      </View>
      <TouchableOpacity onPress={registerVisible}>
        <Text style={styles.new_account}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText} onPress={loginSend}>
          Register
        </Text>
      </TouchableOpacity>
      <Spinner visible={spinner} textContent={'Loading ........ '} textStyle={styles.spinnerTextStyle} animation={'slide'} overlayColor='rgba(0,0,0,0.6)' size={'large'} />
      {massage && <Massage msg={massage} />}
    </View>
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

export default Register
