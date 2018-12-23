import React, { Component } from 'react';
import { Text, View, ScrollView, TextInput, Picker, Button } from 'react-native';
import { Permissions, Notifications } from 'expo';
const moment = require("moment");

import firebase from '../config/firebase';
import styles from '../styles';

const database = firebase.database();

export default class TokenPage extends Component {
    state = {
        tokenName: "",
        tokens: 30,
        tokenAvailabilityInDays: 1,
        companyName: "Test Company",
        companyTokens: [],
        tokenKeys: [],
        updateFlag: false,
        tokenKey: "",
        companyExists: true
    };

    submitTokenRequest() {
        const { tokenAvailabilityInDays, tokens, tokenName, companyName } = this.state;
        const localNotification = {
            title: 'Tokens generated',
            body: `Your tokens are available till ${moment().add(tokenAvailabilityInDays, "days").format("MMMM Do YYYY")}`
        };
        const currentTime = new Date().getTime();
        const timeStamp = currentTime + (tokenAvailabilityInDays * 24 * 60 * 60 * 1000)
        const user = this.props.navigation.getParam("user");
        database.ref(`users/${user.uid}/company/tokens`).push().set({
            tokenName,
            tokenAvailabilityInDays,
            timeStamp,
            tokensBought: 0,
            tokens,
            status: true,
            expired: false,
        });

        Notifications.presentLocalNotificationAsync(localNotification);

        this.setState({
            tokenName: "",
            tokenAvailabilityInDays: 1,
            tokens: 30
        })
    }

    async componentDidMount() {
        const { tokenKeys } = this.state;
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log(status)
        if (status !== "granted") {
            const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            console.log(newStatus)
            if (newStatus !== "granted") {
                console.log("Unable to grant notifications access");
            };
            let token = await Notifications.getExpoPushTokenAsync();
            console.log(token);
        };
        const user = this.props.navigation.getParam("user");
        database.ref(`users/${user.uid}/company`).on('value', snapshot => {
            if (snapshot.exists()) {
                database.ref(`users/${user.uid}/company/tokens`).on("value", tokenSnapshot => {
                    const tokens = [];
                    tokenSnapshot.forEach(token => {
                        if (moment().format("MMMM Do YYYY") === token.val().tokenAvailabilityInDays) {
                            database.ref(`users/${user.uid}/company/tokens/${token.key}`).remove()
                        }
                        else {
                            tokens.push(token.val());
                            tokenKeys.push(token.key)
                            this.setState({ companyTokens: tokens, companyName: snapshot.val().companyName })
                        }
                    });
                    console.log(tokens);
                    this.setState({ companyTokens: tokens })
                })
            }
            else {
                this.setState({ companyExists: false })
            }
        });
    };

    updateToken(token, key) {
        this.setState({
            tokenName: token.tokenName,
            tokens: token.tokens,
            tokenAvailabilityInDays: token.tokenAvailabilityInDays,
            tokenKey: key,
            updateFlag: true
        });
    };

    update = () => {
        const { tokenName, tokens, tokenAvailabilityInDays, tokenKey } = this.state;
        const user = this.props.navigation.getParam("user");
        database.ref(`users/${user.uid}/company/tokens/${tokenKey}`).update({
            tokenName,
            tokens,
            tokenAvailabilityInDays
        });
        this.setState({
            tokenName: "",
            tokens: 30,
            tokenAvailabilityInDays: 1,
            tokenKey: "",
            updateFlag: true
        });
    }

    toggleTokenStatus(key, token) {
        const localNotification = {
            title: 'Success',
            body: `Your token's status has changed`
        };
        const user = this.props.navigation.getParam("user");
        database.ref(`users/${user.uid}/company/tokens/${key}`).update({
            status: token.status ? false : true
        })
        Notifications.presentLocalNotificationAsync(localNotification);
    }

    render() {
        const {
            tokenName,
            tokens,
            companyName,
            tokenAvailabilityInDays,
            companyTokens,
            tokenKeys,
            companyExists
        } = this.state;
        if (!companyExists) {
            return (
                <View style={styles.container}>
                    <Text>It seems you don't have a company registered in this.</Text>
                    <Text>Press the button below to go register your company</Text>
                    <View style={styles.button}>
                        <Button title="Add Company" onPress={() => this.props.navigation.navigate("Company")} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
                    </View>
                </View>
            );
        };
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text>Tokens for: {companyName}</Text>
                <View style={styles.inputContainer}>
                    <Text>Token Name</Text>
                    <TextInput style={styles.input} value={tokenName} onChangeText={(text) => this.setState({ tokenName: text })} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Tokens to be generated</Text>
                    <Picker style={styles.input} selectedValue={tokens} onValueChange={(value, index) => this.setState({ tokens: value })}>
                        <Picker.Item label="30" value={30} />
                        <Picker.Item label="60" value={60} />
                        <Picker.Item label="120" value={120} />
                        <Picker.Item label="240" value={240} />
                        <Picker.Item label="480" value={480} />
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <Text>Tokens availability</Text>
                    <Picker style={styles.input} selectedValue={tokenAvailabilityInDays} onValueChange={(value, index) => this.setState({ tokenAvailabilityInDays: value })}>
                        <Picker.Item label="1 day" value={1} />
                        <Picker.Item label="2 days" value={2} />
                        <Picker.Item label="3 days" value={3} />
                        <Picker.Item label="a week" value={7} />
                        <Picker.Item label="two weeks" value={14} />
                    </Picker>
                </View>
                {<Button title="Generate Tokens" onPress={() => this.submitTokenRequest()} />}
                <Text>Present Available Tokens</Text>
                <View>
                    {companyTokens.map((token, index) => {
                        return (
                            <View style={styles.tokenContainer} key={tokenKeys[index]}>
                                <Text>Token Name: {token.tokenName}</Text>
                                <Text>Token Limits: {token.tokens}</Text>
                                <Text>Tokens Bought: {token.tokensBought}</Text>
                                <Text>Status: {token.status ? "Enabled" : "Disabled"}</Text>
                                <Text>Available till: {moment(token.timeStamp).format("MMMM Do YYYY")}</Text>
                                <Button title="Disable/Enable Tokens" onPress={() => this.toggleTokenStatus(tokenKeys[index], token)} />
                                <Button title="Update Tokens" onPress={() => this.updateToken(token, tokenKeys[index])} />
                            </View>
                        );
                    })}
                </View>
                <View style={styles.button}>
                    <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
                </View>
            </ScrollView>
        );
    };
};