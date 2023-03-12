import React, { useEffect } from 'react'
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Modal } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import DateTime from 'react-native-customize-selected-date'
import errorSend from '../errorSend/errorSend'

function Edit({ id, refresh, setRefresh, setMassage, setEdit }) {
  const [item, setItem] = useState({ imie: '', nazwisko: '', date: 'Wybierz' })
  const [kal, setKal] = useState({ isVisible: false, set: false })
  const [state, setState] = useState({ time: '' })
  const [spinner, setSpinner] = useState(false)

  const customWeekdays = ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pi', 'So']
  const url = `https://biuro.adibau.pl/birthday/list/${id}`
  // const url = `http://192.168.1.123:8080/birthday/list/${id}`

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        {
          const [{ imie, nazwisko, data }] = res
          setItem({ imie, nazwisko, date: data })
        }
      })
      .catch((err) => {
        setMassage('BŁĄD w pobraniu do edycji')
        errorSend({ from: 'Edit', status: err.status, error: err.massage })
      })
  }, [])

  function kalendarzShow() {
    setKal({ isVisible: true })
  }

  function zapisz() {
    if (item.imie !== '' && item.nazwisko !== '' && item.date !== '' && item.date !== 'wybierz') {
      const newItem = { imie: item.imie, nazwisko: item.nazwisko, data: item.date, id: '' + new Date(), last: '', dataLast: '' }
      setSpinner(true)
      fetch(url, {
        method: 'post',
        body: JSON.stringify(newItem),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (res.status === 200) {
            setEdit({ visible: false })
            setMassage('Edycja zakończona poprawnie ')
            setRefresh(!refresh)
            return res
          } else {
            return res.json()
          }
        })
        .then((data) => {
          setSpinner(false)
          data.massage && setMassage(`Nieprawidłowe dane - ${data.massage}`)
        })
        .catch((err) => {
          errorSend({ from: 'Edit zapisz', status: err.status, error: err.massage })
        })
    } else {
      alert('Prosze wypełnić wszystkie pola')
    }
  }

  function selectedDate(date) {
    setKal({ ...kal, isVisible: false, set: true })
    setItem({ ...item, date: date.toString() })
  }
  function renderChildDay(day) {
    //   nic pozostaw
  }

  function anuluj() {
    setEdit({ visible: false })
  }

  function deleteItem() {
    setSpinner(true)
    fetch(url, { method: 'DELETE' })
      .then((res) => {
        {
          setSpinner(false)
          setMassage('Usunięto dane')
          setEdit({ visible: false })
          setRefresh(!refresh)
        }
      })
      .catch((err) => {
        setMassage('BŁĄD w Usunięciu danych')
        errorSend({ from: 'Edit deleteItem', status: err.status, error: err.massage })
      })
  }

  return (
    <>
      <Modal animationType={'fade'} transparent={false} visible={true}>
        <Spinner visible={spinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
        <View style={styles.model}>
          <Text>Edycja danych </Text>
          <View style={styles.view}>
            <Text style={styles.text}>Imie</Text>
            <TextInput
              placeholder='IMIE'
              style={styles.textInput}
              value={item.imie}
              onChange={(text) => {
                setItem({ ...item, imie: text.nativeEvent.text })
              }}
            ></TextInput>
          </View>
          <View style={styles.view}>
            <Text style={styles.text}>Nazwisko</Text>
            <TextInput
              placeholder='NAZWISKO'
              style={styles.textInput}
              value={item.nazwisko}
              onChange={(text) => {
                setItem({ ...item, nazwisko: text.nativeEvent.text })
              }}
            ></TextInput>
          </View>
          <View></View>
          <View style={styles.view}>
            <Text style={styles.text}>Data urodzenia</Text>
            {!kal.isVisible ? <Button color={'#6B7F82'} title={'' + item.date} onPress={kalendarzShow}></Button> : <Text></Text>}
          </View>
          <View>
            {kal.isVisible && (
              <DateTime date={state.time} changeDate={(date) => selectedDate(date)} format='YYYY-MM-DD' renderChildDay={(day) => renderChildDay(day)} customWeekdays={customWeekdays} />
            )}
            <View style={styles.buttons}>
              <View>
                <Button color={'#6B7F82'} title={'Zapisz'} onPress={zapisz}></Button>
              </View>
              <View>
                <Button color={'red'} title={'Usuń'} onPress={deleteItem}></Button>
              </View>
              <View>
                <Button color={'green'} title={'Anuluj'} onPress={anuluj}></Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  model: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00aaff',
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
export default Edit
