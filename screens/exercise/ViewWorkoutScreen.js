import * as React from 'react';
import * as Firebase from 'firebase';
import { StyleSheet, View } from 'react-native';
import { useTheme, FAB, Text, Headline, Divider, List } from 'react-native-paper';
import LoadingScreen from '../LoadingScreen';
import getIcon from './ExerciseIcon';

const styles = StyleSheet.create({
    descriptor: {
        fontSize: 20
    }
});

export default function ViewWorkoutScreen({ route, navigation }) {
    const { day } = route.params;

    const [loaded, setLoaded] = React.useState(false);
    const [workout, setWorkout] = React.useState(null);
    const { colors } = useTheme();

    // TEST
    const userId = '1234567890';

    if (!loaded) {
        Firebase.database().ref(`/users/${userId}/exercisePlan/${day}`).on('value', snapshot => {
            setWorkout(snapshot.val());
            setLoaded(true);
        });
        return <LoadingScreen />;
    } else {
        const exercises = workout.sequence.map((exercise, index) => (
            <List.Item
                key={index}
                title={exercise.type}
                description={exercise.reps ? `X ${exercise.reps}` : `${exercise.time} s`}
                left={props => <List.Icon {...props} icon={getIcon(exercise.type)}/>}
            />
        ));
        return (
            <View style={{ padding: 20 }}>
                <Headline style={{ textAlign: 'center', color: colors.primary }}>{workout.name}</Headline>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 8 }}>
                    <Text style={styles.descriptor}>{workout.time} mins</Text>
                    <Text style={styles.descriptor}>Level {workout.level}/5</Text>
                </View>
                <Divider />
                <Divider />
                <Divider />
                <Divider />
                <Divider />
                {exercises}
                <View style={{ width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <FAB icon='play' />
                    <FAB icon='pencil' />
                </View>
            </View>
        );
    }
}