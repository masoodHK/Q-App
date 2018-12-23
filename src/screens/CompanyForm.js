import React, { Component } from 'react'
import { Text, View, Button, TextInput, Alert, ScrollView } from 'react-native';

import { ImagePicker, Permissions, Location, MapView } from 'expo'

import styles from '../styles';
import firebase from '../config/firebase';
import { FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from '../config/constants';

const storage = firebase.storage();
const database = firebase.database();

export default class MainScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locationForm: false,
            coords: {},
            companyName: "",
            workingSince: "",
            timings: "",
            location: "",
            companyLocation: {},
            locationQuery: "",
            locationResult: [],
            certificates: [],
            locationSection: false
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
                const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                this.setState({ coords });
            }
        }
    }

    takeCertificates = async () => {
        const { certificates } = this.state;
        const result = await ImagePicker.launchImageLibraryAsync();
        if (certificates.length === 3) {
            Alert.alert("Oops", "You have added the maximum number of certificates")
        }
        else {
            if (!result.cancelled) {
                this.setState({ certificates: [...certificates] });
            }
        }
    }

    submitForm = async () => {
        const { certificates, companyName, timings, workingSince, companyLocation } = this.state
        const certificatesURL = []
        certificates.map(async (certificate) => {
            const response = await fetch(certificate.uri);
            const blob = await response.blob();
            var metadata = {
                contentType: 'image/jpeg',
            };
            let name = new Date().getTime() + "-media.jpg"
            const storageRef = storage.ref(`images/${name}`)
            storageRef.put(blob, metadata)
                .then(snapshot => {
                    if (snapshot.state === "")
                        storageRef.getDownloadURL().then(url => {
                            console.log(url);
                            certificatesURL.push(url)
                            if ((index + 1) === certificates.length) {
                                const info = {
                                    certificates: certificatesURL,
                                    companyName,
                                    workingSince,
                                    location: companyLocation,
                                    timings
                                }
                            }
                        })
                })
        })
    }

    showMap = (coords) => {
        this.setState({
            companyLocation: {
                latitude: coords.lat,
                longitude: coords.lng
            },
            locationSection: true
        })
    }
    search = () => {
        const { locationQuery } = this.state
        Location.getCurrentPositionAsync({ enableHighAccuracy: true }).then(coords => {
            console.log(coords)
            fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20180323&query=${locationQuery}&ll=${coords.lattitude},${coords.longitude}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.setState({locationResult: data.response.groups[0].items})})
                .catch(error => console.log(error))
        })
    }

    render() {
        const { locationForm, locationSection, locationQuery, coords, locationResult } = this.state;

        if (locationForm) {
            if (locationSection) {
                return (
                    <View style={styles.container}>
                        <MapView loadingEnabled region={coords} />
                        <View style={styles.button}>
                            <Button title="Go Back" onPress={() => this.setState({ locationSection: false })} />
                        </View>
                    </View>
                );
            }
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput value={locationQuery} style={styles.input} onChangeText={(text) => this.setState({ locationQuery: text })} />
                        <Button title="Find Location" onPress={() => this.search()} />
                    </View>
                    {locationResult.length === 0 ? 
                        <Text>Search for your location</Text> :
                        <View style={styles.inputContainer}>
                            {locationResult.map(result => {
                                return (
                                    <View style={styles.tokenContainer}>
                                        <Text>{result.venue.name}</Text>
                                        <Text>{result.venue.location.formattedAddress.join(", ")}</Text>
                                        <Text>Ratings: {result.venue.rating}</Text>
                                        <Button title="Show Location" onPress={() => this.showMap(result.venue.location)}/>
                                    </View>
                                );
                            })}
                        </View>}
                    <View style={styles.button}>
                        <Button title="Go Back" onPress={() => this.setState({ locationSection: false })} />
                    </View>
                </ScrollView>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text>Company Name</Text>
                    <TextInput style={styles.input} onChangeText={(text) => this.setState({ companyName: text })} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Working Since</Text>
                    <TextInput style={styles.input} onChangeText={(text) => this.setState({ workingSince: text })} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Certificates</Text>
                    <Button title="Add One Certificate" onPress={() => this.takeCertificates()} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Timings</Text>
                    <TextInput style={styles.input} onChangeText={(text) => this.setState({ timings: text })} />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Location</Text>
                    <Button title="Find your location" onPress={() => this.setState({ locationForm: true })} />
                </View>
                <View style={styles.button}>
                    <Button title="Submit" onPress={() => console.log("Company")} />
                </View>
            </View>
        )
    }
}
