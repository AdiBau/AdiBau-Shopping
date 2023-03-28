import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"

import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Icon1 from "react-native-vector-icons/MaterialIcons"
import Icon3 from "react-native-vector-icons/Entypo"

import { useEffect, useState, useRef, useCallback } from "react"
import Massage from "../components/massage"
import homeOrSerwer from "./homeOrSerwer"

const ListAll = ({ setMassage, setViews, setListID, setSpinner }) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState([])
  const [addItemView, removeItemView] = useState(false)
  const [addItemText, setAddItemText] = useState("")

  useEffect(() => {
    loadData()
  }, [refresh])

  const url = homeOrSerwer ? "http://192.168.1.123:8080/listName" : "https://shopping.adibau.pl/listName"

  const loadData = () => {
    setSpinner(true)

    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          setSpinner(false)
          return setViews({ login: true })
        }
      })
      .then((dane) => {
        setData(dane)
        setSpinner(false)
      })

      .catch((err) => {
        setMassage("Sorry please try again later")
        console.log("Logowanie error - ", { err })
        setSpinner(false)
      })
    // only in https
  }

  const dodaj = () => {
    if (!addItemText) {
      return removeItemView(false)
    }
    setSpinner(true)
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ item: addItemText }),
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => {
      if (data.status === 201) {
        setAddItemText("")
        removeItemView(false)
        setMassage("Dodano do listy")
        setRefresh(!refresh)
      } else {
        setMassage("Nie dodano do listy !!!")
      }
      setSpinner(false)
    })
  }

  const deleteItem = (id) => {
    setSpinner(true)
    fetch(`${url}/${id}`, {
      method: "DELETE",
    }).then((data) => {
      if (data.status === 200) {
        setRefresh(!refresh)
      } else {
        setMassage("Nie wykasowano")
      }
      setSpinner(false)
    })
  }

  const addItem = () => {
    removeItemView(!addItemView)
  }
  const choice = (e) => {
    setListID(e)

    setViews({ home: true })
    // setSpinner(false)
  }
  const logOut = () => {
    setSpinner(true)
    const url = homeOrSerwer ? "http://192.168.1.123:8080/logout" : "https://shopping.adibau.pl/logout"
    fetch(url).then((data) => {
      if (data.status === 200) {
        setMassage("Wylogowano poprawnie")
        setRefresh(!refresh)
      } else {
        setMassage("Nie wylogowano")
      }
      setSpinner(false)
    })
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.viewList}>
          <TouchableOpacity style={styles.viewMenu} onPress={logOut}>
            <Text style={styles.viewMenu.text}>Wyloguj</Text>
            <Icon name='logout' size={22} style={styles.icons} />
          </TouchableOpacity>
          <View style={styles.viewChoice}>
            {data.length === 0 && (
              // <TouchableOpacity style={styles.item} onPress={() => choice(item.id)}>
              <View style={styles.item.viewText}>
                <Text style={styles.item.text}>Lista pusta, utwórz liste</Text>
              </View>
              // </TouchableOpacity>
            )}
            <FlatList
              keyboardDismissMode='none'
              data={data}
              renderItem={({ item }) => (
                <>
                  <TouchableOpacity style={styles.item} onPress={() => choice(item.id)}>
                    <View style={styles.item.viewIcon}>
                      <Icon name='delete' size={25} style={styles.item.viewIcon.icon} onPress={() => deleteItem(item.id)}></Icon>
                    </View>
                    <View style={styles.item.viewText}>
                      <Text style={styles.item.text}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
              keyExtractor={(item) => item.id}
            ></FlatList>
            <TouchableOpacity>
              {addItemView && (
                <View style={[styles.item, styles.inputView]}>
                  <TextInput
                    style={styles.input}
                    keyboardAppearance='dark'
                    placeholder='Twoja nazwa'
                    value={addItemText}
                    multiline={true}
                    maxLength={100}
                    autoFocus={true}
                    onChangeText={(text) => setAddItemText(text)}
                    cursorColor={"black"}
                  />
                  <Button title='save' onPress={dodaj}></Button>
                </View>
              )}
              <View style={styles.itemAdd}>
                <Icon3 name='add-to-list' size={25} style={styles.item.viewIcon.icon} onPress={addItem}></Icon3>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29a6dc",
  },

  inputView: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 20,
    width: "80%",
    // alignSelf: "center",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  viewList: {
    flex: 1,
    width: "95%",
    borderRadius: 15,
    // height: 160,
    marginTop: getStatusBarHeight(),
    marginBottom: 5,
    paddingTop: 5,
    alignSelf: "center",
    // backgroundColor: "#E6EBE0",
    // backgroundColor: "transparent",
  },
  viewMenu: {
    width: "99%",
    flexDirection: "row",
    // backgroundColor:'red',
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 5,
    borderBottomColor: "#0d0106",
    borderBottomWidth: 1,
    text: {
      fontSize: 16,
      marginRight: 5,
    },
  },
  viewChoice: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    flexWrap: "nowrap",
    flexGrow: 1,
    borderWidth: 2,
    borderColor: "lightgrey",
    backgroundColor: "#29a6dc",
    margin: 10,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 15,
    // justifyContent:'space-between',
    viewText: {
      width: "80%",
      //   backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
    },

    text: {
      fontSize: 22,
      fontWeight: "bold",
    },
    viewIcon: {
      width: 50,
      paddingHorizontal: 10,
      icon: {
        color: "#0d0106",
      },
    },
  },
  itemAdd: {
    alignItems: "flex-end",
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
})

export default ListAll
