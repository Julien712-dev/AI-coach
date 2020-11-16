import React, { useState } from 'react';
import config from '../../config';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Text, Title, Card, Paragraph, TextInput } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

export default function EntranceSurveyScreen({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    return (
        <ScrollView>
            <View style={{flex: 1}}>
            <Button icon="close" style={{ position: 'absolute', top:20, right:0 }} onPress={() => navigation.goBack()}>Skip</Button>
                <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', flex: 1 }}>
                    <Text>Set up your profile for a better user experience! </Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <TextInput style={styles.inputStyle} label='First Name' mode='outlined' value={firstName} onChangeText={text => setFirstName(text)} autoCorrect={false}></TextInput>
                <TextInput style={styles.inputStyle} label='Last Name' mode='outlined' value={lastName} onChangeText={text => setLastName(text)} autoCorrect={false}></TextInput>
            </View>
            <Button style={styles.btnStyle} mode='contained'>create profile</Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        flex: 1,
        marginHorizontal: 10
    },
    btnStyle: {
        margin: 10,
        alignSelf: "center"
    }
})