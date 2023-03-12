import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/AntDesign'

import NewDate from './newDate'

function Header({ setRefresh, refresh, setMassage }) {
  const [stateAdd, setStateAdd] = useState(false)

  function addClick() {
    setStateAdd({ isVisible: true })
  }

  return (
    <>
      <View style={styles.titel}>
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => {}}>
            <Icon2 name={'menufold'} size={20} color='#000'></Icon2>
            <View style={styles.logOut}>
              <Icon name='logout' size={20} color='#000' />
              <Text>LOG OUT</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.containerImg}>
          <Image source={require('../assets/newLogoSmall.png')} resizeMode='stretch' style={{ width: '95%', height: 130 }} />
        </View>

        <View style={styles.viewButtons}>{!stateAdd.isVisible && <Button title='Add new Date' onPress={addClick}></Button>}</View>
      </View>
      {stateAdd.isVisible && <NewDate setRefresh={setRefresh} newDateVisible={setStateAdd} refresh={refresh} setMassage={setMassage} />}
    </>
  )
}

const styles = StyleSheet.create({
  containerImg: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  titel: {
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
    height: 'auto',
  },
  font: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  viewButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 5,
  },
  logOut: {
    display: 'none',
    flexDirection: 'row',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    margin: 0,
    padding: 0,
  },
  menu: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 'auto',
  },
})
export default Header
