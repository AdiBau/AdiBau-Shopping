import React from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'

import { useEffect, useState } from 'react'
import Header from '../components/header'
import Edit from '../components/edit'
import errorSend from '../errorSend/errorSend'

const Home = ({ setMassage, setViews }) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState([])
  const [edit, setEdit] = useState({ visible: false, id: '' })

  let base = []

  useEffect(() => {
    loadData()
  }, [refresh])

  const loadData = () => {
     const url = 'https://biuro.adibau.pl/birthday/list'
   // const url = 'http://192.168.1.123:8080/birthday/list'

    fetch(url)
      .then((response) => {
        console.log(response.status)
        if (response.status === 200) {
          return response.json()
        } else {
          return setViews({ login: true })
        }
      })
      .then((res) => {
        setData(res)
      })
      .catch((err) => errorSend({ from: 'Home loadData', status: err.status, error: err.massage }))

    base = []
    modifyList()
  }

  const pozostalo = (date) => {
    const month = date[5] + date[6]
    const day = date[8] + date[9]
    let last = Math.floor((new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()) - new Date(new Date().getFullYear(), Number(month), Number(day))) / 1000 / 60 / 60 / 24)
    return last < 0 ? (last = Math.abs(last)) : 365 - last
  }

  const modifyList = () => {
    data.map((e) => {
      base.push({
        nazwisko: e.nazwisko,
        imie: e.imie,
        data: e.data,
        id: e.id,
        last: pozostalo(e.data),
        dataLast: new Date(),
      })
    })
  }

  modifyList()
  function sortBaza() {
    return base.sort(function (a, b) {
      let x = a.last
      let y = b.last
      return x < y ? -1 : x > y ? 1 : 0
    })
  }

  const wiek = (data) => {
    return Math.floor((new Date() - new Date(data)) / 1000 / 60 / 60 / 24 / 364)
  }

  function editing(id) {
    setEdit({ visible: true, id: id })
  }

  return (
    <>
      <View style={styles.container}>
        <Header setRefresh={setRefresh} refresh={refresh} setMassage={setMassage} />
        <Text style={styles.line}></Text>
        {edit.visible && <Edit id={edit.id} refresh={refresh} setRefresh={setRefresh} setMassage={setMassage} setEdit={setEdit} />}
        <FlatList
          data={sortBaza()}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity onLongPress={() => editing(item.id)}>
                <View style={[styles.viewItem, pozostalo(item.data) < 10 ? { backgroundColor: 'rgba(0, 255, 0, 0.5)' } : '']}>
                  <View style={styles.imageView}>
                    <Image
                      style={styles.image}
                      resizeMode='stretch'
                      // style={styles.image}
                      source={require('../assets/1024px-Brak_zdjęcia.svg.png')}

                      // uri: `http://192.168.1.123:8080/birthday/image/${item.image}`,
                    />
                  </View>
                  <View style={styles.name}>
                    <Text style={styles.text}>
                      {item.nazwisko} {item.imie}
                    </Text>

                    <Text style={styles.text}>ur.{item.data}</Text>
                    <Text style={styles.text}>lat.{wiek(item.data)}</Text>
                  </View>
                  <View style={styles.pozostalo}>
                    <Text style={styles.text}>Pozostało</Text>
                    <Text style={styles.text}>{pozostalo(item.data)} dni</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // paddingTop: 35,
    backgroundColor: 'rgb(142, 184, 229)',
  },
  imageView: {
    width: '24%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    width: '40%',
    textAlign: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 15,
  },
  viewItem: {
    alignSelf: 'center',
    width: '95%',
    height: 80,
    marginTop: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  line: {
    width: '100%',
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  textItem: { fontWeight: 'bold' },
  pozostalo: {
    width: '20%',
    textAlign: 'center',
    alignItems: 'center',
  },
})

export default Home
