import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, FAB, Text, Headline, Divider, List } from 'react-native-paper';

export default function ViewWorkoutScreen({ navigation }) {
    const styles = StyleSheet.create({
        descriptor: {
            fontSize: 20
        }
    });
    const { colors } = useTheme();

    return (
        <View style={{ padding: 20 }}>
            <Headline style={{ textAlign: 'center', color: colors.primary }}>Arm Workout</Headline>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 8 }}>
                <Text style={styles.descriptor}>20 mins</Text>
                <Text style={styles.descriptor}>Level 4/5</Text>
            </View>
            <Divider />
            <Divider />
            <Divider />
            <Divider />
            <Divider />
            <List.Item
                title='Push up'
                description='X 20'
                left={props => <List.Icon {...props} icon='karate' />}
            />
            <List.Item
                title='Reverse crunches'
                description='X 40'
                left={props => <List.Icon {...props} icon='rowing' />}
            />
            <List.Item
                title='Side plank left'
                description='60s'
                left={props => <List.Icon {...props} icon='bike' />}
            />
            <List.Item
                title='Side plank right'
                description='60s'
                left={props => <List.Icon {...props} icon='bike' />}
            />
            <View style={{ width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                <FAB icon='play' />
                <FAB icon='pencil' />
            </View>
        </View>
    );
}