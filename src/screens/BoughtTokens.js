import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'

import firebase from '../config/firebase';
import styles from '../styles';

const database = firebase.database()

export default class BoughtTokens extends Component {
    state = {
        companyTokens: [],
        tokenKeys: []
    }
    componentDidMount = () => {
        const user = this.props.navigation.getParam("user");
        database.ref(`users/${user.uid}/company/tokensBought`).on("value", tokenSnapshot => {
            const tokens = [];
            const tokenKeys = [];
            tokenSnapshot.forEach(token => {
                if (moment().format("MMMM Do YYYY") === token.val().tokenAvailabilityInDays) {
                    database.ref(`users/${user.uid}/company/tokens/${token.key}`).remove()
                }
                else {
                    tokens.push(token.val());
                    tokenKeys.push(token.key)
                }
            });
            console.log(tokens);
            this.setState({ companyTokens: tokens, tokenKeys })
        })
    }

    render() {
        const { companyTokens, tokenKeys } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text> Bought Tokens </Text>
                {companyTokens.length === 0 ? 
                <View style={styles.container}>
                    <Text>No tokens bought</Text>
                </View> :
                companyTokens.map(token => {
                    return (
                        <View style={styles.tokenContainer} key={tokenKeys[index]}>
                            <Text>Token Name: {token.tokenName}</Text>
                            <Text>Tokens Bought: {token.tokensBought}</Text>
                            <Text>Available till: {moment(token.timeStamp).format("MMMM Do YYYY")}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        )
    }
}
