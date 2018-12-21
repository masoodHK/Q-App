import React, { Component } from 'react'
import { Text, View, Button } from 'react-native';

import styles from '../styles';

export default class MainScreen extends Component {
    render() {
        const user = this.props.navigation.getParam("userData")
        return (
            <View style={styles.container}>
                <Text> Welcome {user.displayName} </Text>
                <View style={styles.button}>
                    <Button title="Are you a company?" onPress={() => console.log("Company")} />
                </View>
                <View style={styles.button}>
                    <Button title="Are you looking to buy tokens?" onPress={() => console.log("Individual")} />
                </View>
            </View>
        )
    }
}
