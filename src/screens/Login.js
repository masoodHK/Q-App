import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { Facebook } from 'expo'

import styles from '../styles';
import firebase from '../config/firebase';
import { FACEBOOK_APP_ID } from '../config/constants';

const auth = firebase.auth();
const provider = firebase.auth.FacebookAuthProvider

export default class Login extends Component {

	componentDidMount() {
		auth.onAuthStateChanged(user => {
			if (user) {
				this.props.navigation.navigate("Main", {
					userData: user
				})
			}
		})
	}

	login = async () => {
		const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
			permissions: ['public_profile']
		})
		if (type === "success") {
			const credentials = provider.credential(token);
			auth.signInAndRetrieveDataWithCredential(credentials)
				.then(user => {
					this.props.navigation.navigate("Main", {
						userData: user.user
					})
				})
				.catch(error => {
					console.log(error);
				});
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text> Login </Text>
				<View style={styles.button}>
					<Button
						title="Login via Facebook"
						onPress={() => this.login()} />
				</View>
			</View>
		)
	}
}
