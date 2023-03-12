import React from 'react'
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'
import Modal from 'react-native-modal'

const Massage = ({ msg }) => {
  if (typeof msg === 'string') {
    if (msg.length > 0) {
      return (
        <>
          <Modal isVisible={true} animationIn={'bounceIn'} animationOut={'fadeInDown'}>
            <View style={styles.massage}>
              <Text style={styles.massage.text}>{msg}</Text>
            </View>
          </Modal>
        </>
      )
    }
  }
  return null
}
const styles = StyleSheet.create({
  model: {
    flex: 1,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  massage: {
    borderColor: '#ddd',
    backgroundColor: '#7C99B4',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',

    text: {
      fontSize: 18,
    },
  },
})

export default Massage
