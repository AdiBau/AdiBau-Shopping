import React, { useEffect, useState } from "react"
import axios from "axios"
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"
import homeOrSerwer from "./homeOrSerwer"

const Login = ({ setViews, setMassage, setSpinner }) => {
  const [data, setData] = useState({ email: "", password: "" })

  const loginSend = async () => {
    if (!data.email || !data.password) {
      return setMassage("Prosze wpisać email i PIN")
    }
    setSpinner(true)
    const url = homeOrSerwer ? "http://192.168.1.123:8080/login" : "https://shopping.adibau.pl/login"
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((data) => {
        console.log(data.status)
        if (data.status === 202) {
          setViews({ login: false, listAll: true })
        } else {
          setMassage("Błędny email lub password")
          console.log(data.status)
        }
        if (data.status === 502) {
          setViews({ login: true })
          setMassage("Coś sie porobiło pracuje nad tym")
        }
        setSpinner(false)
      })

      .catch((err) => {
        setMassage("Sorry please try again later")
        console.log("Logowanie error - ", { err })
        setSpinner(false)
      })
    // only in https
    setData({})
  }

  const registerVisible = () => {
    setViews({ register: true })
  }

  return (
    <>
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/adibauBirthdayReminder.png")} />

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder='email'
            placeholderTextColor='#003f5c'
            keyboardType='email-address'
            value={data.email}
            onChangeText={(email) => setData({ ...data, email })}
            maxLength={30}
            returnKeyType='done'
            autoComplete='email'
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder='Password PIN'
            placeholderTextColor='#003f5c'
            secureTextEntry={true}
            onChangeText={(password) => setData({ ...data, password })}
            value={data.password}
            keyboardType={"decimal-pad"}
            maxLength={10}
            returnKeyType='done'
          />
        </View>
        <TouchableOpacity onPress={registerVisible} style={styles.new_account}>
          <Text>New Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={loginSend}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </>
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
    width: "40%",
    borderRadius: 15,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#70cb89",
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

export default Login
