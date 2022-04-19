import React from 'react'
import { View,StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import AddTransaction from './views/AddTransaction'
function Main(props) {
    return (<View style={styles.container}><AddTransaction props={props} /></View>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default Main