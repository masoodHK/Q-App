import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

import firebase from '../config/firebase';
import styles from '../styles';

const database = firebase.database()

export default class TokenSearch extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> Search For Tokens </Text>
        
      </View>
    )
  }
}
