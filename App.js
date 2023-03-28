import React, { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View, BackHandler } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"

import Login from "./views/login"
import Register from "./views/register"
import Home from "./views/home"
import Spinner from "react-native-loading-spinner-overlay"
import Massage from "./components/massage"
import ListAll from "./views/listAll"

export default function App() {
  const [views, setViews] = useState({ login: false, register: false, home: false, listAll: true })
  const [spinner, setSpinner] = useState(false)
  const [massage, setMassage] = useState("")
  const [listID, setListID] = useState(null)
  //
  //
  const backActionHandler = (e) => {
    if (views.login) {
      BackHandler.exitApp()
    }
    if (views.register) {
      setViews({ login: true })
    }
    if (views.home) {
      setViews({ listAll: true })
    }

    if (views.listAll) {
      BackHandler.exitApp()
    }
    return true
  }

  useEffect(() => {
    setTimeout(() => setMassage(""), 2000)
  }, [massage])
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler)
    return () => BackHandler.removeEventListener("hardwareBackPress", backActionHandler)
  }, [views])

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      {views.login && <Login view={views} setViews={setViews} setMassage={setMassage} setSpinner={setSpinner} />}
      {views.register && <Register view={views} setViews={setViews} setMassage={setMassage} setSpinner={setSpinner} />}
      {views.listAll && <ListAll view={views} setViews={setViews} setMassage={setMassage} setListID={setListID} setSpinner={setSpinner} />}

      {views.home && <Home view={views} setViews={setViews} setMassage={setMassage} listID={listID} setSpinner={setSpinner} />}

      {massage && <Massage msg={massage} />}
      <Spinner visible={spinner} textContent={"Loading ........ "} textStyle={styles.spinnerTextStyle} animation={"slide"} overlayColor='rgba(0,0,0,0.6)' size={"large"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#29a6dc",
    height: "100%",
    width: "100%",
  },
})
