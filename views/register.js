import React from "react"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"

import homeOrSerwer from "./homeOrSerwer"

const Register = ({ setViews, setMassage }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginSend = async () => {
    const data = { email: email, password: password }

    const url = homeOrSerwer ? "http://192.168.1.123:8080/register" : "https://shopping.adibau.pl/register"
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setViews({ login: true, register: false })
          setMassage("You are registered, please login yet")
          setSpinner(false)
        } else {
          setMassage("Please enter another email")
          setSpinner(false)
        }
      })
      .catch((err) => {
        setMassage("Sorry please try again later")
        setSpinner(false)
      })
    setEmail("")
    setPassword("")
  }

  const registerVisible = () => {
    setViews({ login: true })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/adibauBirthdayReminder.png")} />
      <StatusBar style='dark' backgroundColor={styles.container.backgroundColor} />
      <View style={styles.inputView}>
        <TextInput style={styles.TextInput} placeholder='EMAIL Address' placeholderTextColor='#003f5c' value={email} onChangeText={(text) => setEmail(text)} maxLength={40} keyboardType='default' />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='PIN number'
          placeholderTextColor='#003f5c'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          value={password}
          keyboardType={"decimal-pad"}
          maxLength={10}
        />
      </View>
      <TouchableOpacity onPress={registerVisible}>
        <Text style={styles.new_account}>Back to LogIn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText} onPress={loginSend}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
    fontSize: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#29a6dc",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "center",
  },
  inputView: {
    backgroundColor: "#dddddd",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  new_account: {
    marginTop: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 30,
    fontSize: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#dddddd",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "lightgreen",
  },
})

export default Register
