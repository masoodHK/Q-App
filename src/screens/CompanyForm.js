import React, { Component } from 'react'
import { Text, View, Button, TextInput, Alert } from 'react-native';

import { ImagePicker, Permissions, Location, MapView } from 'expo'

import styles from '../styles';

export default class MainScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: false,
            coords: {},
            certificates: []
        }
    }

    componentDidMount = async () => {
        const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL, Permissions.LOCATION);
        if (status !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.LOCATION);
            if (status !== "granted") {
                Alert.alert("Warning", "You need to allow us or we can't let you register")
            }
            else {
                const { coords } = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
                this.setState({ coords });
            }
        }
    }

    takeCertificates = async () => {
        const { certificates } = this.state;
        const result = await ImagePicker.launchImageLibraryAsync();
        if(certificates.length === 3) {
            Alert.alert("Oops", "You have added the maximum number of certificates")
        }
        else {
            if(!result.cancelled) {
                this.setState({ certificates: [...certificates] });
            }
        }
    }

    submitForm = () => {
        
    }

    render() {
        const user = this.props.navigation.getParam("userData");
        const { form } = this.state;

        if (!form) {
            return (
                <View style={styles.container}>
                    <Button title="Add your company" onPress={() => this.setState({ form: true })} />
                </View>
            )
        }
        else {
            return (
                <View style={styles.container}>
                    <View>
                        <Text>Company Name</Text>
                        <TextInput />
                    </View>
                    <View>
                        <Text>Working Since</Text>
                        <TextInput />
                    </View>
                    <View>
                        <Text>Certificates</Text>
                        <Button title="Add One Certificate" onPress={() => console.log("event")} />
                    </View>
                    <View>
                        <Text>Timings</Text>
                        <TextInput />
                    </View>
                    <View>
                        <Text>Timings</Text>
                        <TextInput />
                    </View>
                    <View style={styles.button}>
                        <Button title="Submit" onPress={() => console.log("Company")} />
                    </View>
                </View>
            )
        }
    }
}
