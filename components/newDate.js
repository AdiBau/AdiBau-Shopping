import React from 'react'
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native'
import DateTime from 'react-native-customize-selected-date'
import errorSend from '../errorSend/errorSend'

function NewDate({ setRefresh, newDateVisible, refresh, setMassage }) {
  const [name, setName] = useState({ imie: '', nazwisko: '' })
  const [kal, setKal] = useState({ isVisible: false, set: false, date: 'Wybierz' })
  const [state, setState] = useState({ time: '' })

  let newItem = []

  const customWeekdays = ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pi', 'So']

  function kalendarzShow() {
    setKal({ isVisible: true })
  }
  function zapisz() {
    if (name.imie !== '' && name.nazwisko !== '' && kal.date !== '') {
      newItem.push({ imie: name.imie, nazwisko: name.nazwisko, data: kal.date, last: '', dataLast: '' })

      const url = 'https://biuro.adibau.pl/birthday/list'
      // const url = 'http://192.168.1.123:8080/birthday/list'

      fetch(url, {
        method: 'post',
        body: JSON.stringify(newItem[0]),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (res.status === 200) {
            setMassage('Zapis do bazy udany')
            setRefresh(!refresh)
            newDateVisible(false)
            return res
          } else {
            return res.json()
          }
        })
        .then((res) => {
          res.massage && setMassage(`ERROR - ${res.massage}`)
        })
        .catch((err) => {
          setMassage(`ERROR - try again later`, err)
          errorSend({ from: 'newDate POST', status: err.status, error: err.massage })
        })
    } else {
      alert('Prosze wypełnić wszystkie pola')
    }
  }

  function selectedDate(date) {
    setKal({ ...kal, isVisible: false, set: true, date: date.toString() })
  }
  function renderChildDay(day) {
    //   nic pozostaw
  }

  function anuluj() {
    newDateVisible(false)
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>Imie</Text>
          <TextInput
            placeholder='IMIE'
            style={styles.textInput}
            value={name.imie}
            onChange={(text) => {
              setName({ ...name, imie: text.nativeEvent.text })
            }}
          ></TextInput>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>Nazwisko</Text>
          <TextInput
            placeholder='NAZWISKO'
            style={styles.textInput}
            value={name.nazwisko}
            onChange={(text) => {
              setName({ ...name, nazwisko: text.nativeEvent.text })
            }}
          ></TextInput>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>Data urodzenia</Text>
          {!kal.isVisible && <Button color={'#6B7F82'} title={kal.date} onPress={kalendarzShow}></Button>}
        </View>
        <View>
          {kal.isVisible && (
            <View style={styles.calendar}>
              <DateTime date={state.time} changeDate={(date) => selectedDate(date)} format='YYYY-MM-DD' renderChildDay={(day) => renderChildDay(day)} customWeekdays={customWeekdays} />
            </View>
          )}
          <View style={styles.buttons}>
            <View>
              <Button color={'#6B7F82'} title='Zapisz' onPress={zapisz}></Button>
            </View>
            <View>
              <Button color={'red'} title='Anuluj' onPress={anuluj}></Button>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
  },
  container: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
    flex: 1,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    display: 'flex',
    flex: 2,
    borderWidth: 1,
    borderColor: 'blue',
    padding: 5,
    paddingHorizontal: 15,
    fontWeight: 'bold',
  },
  view: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    borderColor: 'blue',
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7C99B4',
  },
  buttons: {
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
})
export default NewDate
