import React from "react"
import { ImageBackground, View, Text, StyleSheet, FlatList, Image, TouchableOpacity, check, Keyboard } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"
import { TextInput, Button, Menu } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Icon1 from "react-native-vector-icons/MaterialIcons"

import Icon2 from "react-native-vector-icons/AntDesign"

import { useEffect, useState, useRef, useCallback } from "react"
import homeOrSerwer from "./homeOrSerwer"

const Home = ({ setMassage, setViews, listID, setSpinner }) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState()
  const [text, setText] = useState("")
  const [cena, setCena] = useState("")
  const textInput = useRef(null)
  const priceInput = useRef(null)

  useEffect(() => {
    loadData()
  }, [refresh])

  const url = homeOrSerwer ? `http://192.168.1.123:8080/list/${listID}` : `https://shopping.adibau.pl/list/${listID}`
  const loadData = () => {
    setSpinner(true)

    fetch(url)
      .then((response) => {
        setTimeout(() => setSpinner(false), 500)

        if (response.status === 200) {
          return response.json()
        } else {
          return setViews({ login: true })
        }
      })
      .then((dane) => setData(dane))
      .catch((err) => {
        setMassage("Sorry please try again later")
        console.log("Logowanie error - ", { err })
        setSpinner(false)
      })
  }

  const dodaj = () => {
    setSpinner(true)
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ item: text, price: cena, Id_List: listID }),
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => {
      setSpinner(false)
      if (data.status === 201) {
        return setRefresh(!refresh)
      } else {
        return setMassage("Nie dodano do listy !!!")
      }
    })
    priceInput.current.clear(true)
    textInput.current.clear(true)
    priceInput.current.blur()
    textInput.current.blur()
  }
  // 44 - on iPhoneX
  // 20 - on iOS device
  // X - on Android platfrom (runtime value)
  // 0 - on all other platforms (default)

  // will be 0 on Android, because You pass true to skipAndroid
  const editing = (id) => {}
  const suma = (data) => {
    let sumPrice = 0
    if (!data) {
      return
    }
    data.forEach((element) => {
      sumPrice += element.price
    })
    return sumPrice
  }
  const logOut = () => {
    setSpinner(true)
    const urlLogOut = homeOrSerwer ? "http://192.168.1.123:8080/logout" : "https://shopping.adibau.pl/logout"
    fetch(urlLogOut).then((data) => {
      if (data.status === 200) {
        setMassage("Wylogowano poprawnie")
        setRefresh(!refresh)
      } else {
        setMassage("Nie wylogowano")
      }
      setSpinner(false)
    })
  }

  const deleteItem = (id) => {
    const urlDelete = homeOrSerwer ? `http://192.168.1.123:8080/list/${id}` : `https://shopping.adibau.pl/list/${id}`
    setSpinner(true)
    setMassage("Kasuje")
    fetch(urlDelete, {
      method: "DELETE",
    }).then((data) => {
      if (data.status === 200) {
        setRefresh(!refresh)
        setMassage("Wykasowano")
      } else {
        setMassage("Nie wykasowano")
      }
      setSpinner(false)
    })
  }
  const checked = () => {}

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.viewMenu} onPress={logOut}>
          <Text style={styles.viewMenu.text}>Wyloguj</Text>
          <Icon name='logout' size={22} style={styles.icons} />
        </TouchableOpacity>
        <View style={styles.viewTextInput}>
          <TextInput
            ref={textInput}
            style={styles.TextInput}
            label='Dopisz do listy'
            mode='flat'
            onChangeText={(text) => setText(text)}
            value={text}
            autoFocus={false}
            //
            returnKeyType='done'
            maxLength={100}
            keyboardType={"default"}
            multiline={true}
            onEndEditing={this.clearFocus}
            onSubmitEditing={Keyboard.dismiss}
            right={<TextInput.Icon icon='eye' />}
          />
          <TextInput
            ref={priceInput}
            style={styles.TextInput}
            right={<TextInput.Icon icon='eye' />}
            label='cena'
            mode='flat'
            onChangeText={(text) => setCena(text)}
            value={cena}
            maxLength={10}
            keyboardType={"decimal-pad"}
            returnKeyType='done'
            onSubmitEditing={Keyboard.dismiss}
            onEndEditing={this.clearFocus}
          />

          <Button style={styles.button} icon='transfer-down' mode='contained-tonal' onPress={dodaj}>
            ZAPISZ
          </Button>
        </View>

        <View style={styles.shoppingList}>
          {!data ? (
            <Text> - Brak - Lista pusta </Text>
          ) : (
            <View style={styles.lista}>
              <Text style={styles.listaItem}>Twoja lista</Text>
              <Text style={styles.listaPrice}>Kwota</Text>
            </View>
          )}

          <FlatList
            data={data}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity onLongPress={checked}>
                  <View style={styles.item}>
                    <Icon name='delete' size={20} color='#0f0f0f' onPress={() => deleteItem(item.id)}></Icon>

                    {/* <TextInput ref={check} editable={false} style={styles.text} mode='text' value={item.item} maxLength={100} keyboardType={"default"} multiline={true} /> */}
                    <Text style={styles.text}>{item.item}</Text>
                    {<Text style={styles.textCena}> {item.price} zł</Text>}
                  </View>
                </TouchableOpacity>
              </>
            )}
            keyExtractor={(item) => item.id}
          ></FlatList>
        </View>
        <View style={styles.podsumowanie}>
          <Text> - Wszystkie wpisy - {!data ? 0 : data.length}</Text>
          <Text> - Przewidywana kwota - {suma(data)}</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29a6dc",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: getStatusBarHeight(),
    // marginBottom: getDeviceHeight(),
  },
  image: {},
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
  button: {
    // width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 1,
    marginVertical: 10,
    borderWidth: 3,
    borderColor: "#29a6dc",
    textColor: "black",
  },
  viewTextInput: {
    width: "98%",
    marginTop: 5,
    marginBottom: 15,
    paddingTop: 2,
    alignSelf: "center",
    backgroundColor: "rgba(200,200,200,0.5)",
    borderRadius: 25,
  },
  TextInput: {
    padding: 1,
    marginVertical: 2,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: "95%",
    alignSelf: "center",
    color: "white",
    backgroundColor: "transparent",
    borderRadius: 15,
  },
  shoppingList: {
    flex: 1,
    marginHorizontal: 10,
  },
  lista: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  listaItem: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listaPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    width: "96%",

    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
    flexWrap: "nowrap",
  },
  text: {
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "transparent",
    textAlign: "center",
    // flexShrink: 1,
  },

  podsumowanie: {
    display: "flex",
    marginVertical: 2,
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: `space-between`,
  },
})

export default Home
