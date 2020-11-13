import React, { useState, useEffect } from 'react';
import Firebase from 'firebase';
import { StyleSheet, View } from 'react-native';
import { useTheme, FAB, Text, Headline, List, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { DraxList } from 'react-native-drax';
import LoadingScreen from '../LoadingScreen';
import getIcon from './ExerciseIcon';
import MultiDivider from '../../components/MultiDivider';

const styles = StyleSheet.create({
    descriptor: {
        fontSize: 20
    }
});

function ExerciseItem({ item }) {
    return (
        <List.Item
            title={item.type}
            description={item.reps ? `X ${item.reps}` : `${item.time} s`}
            left={props => <List.Icon {...props} icon={getIcon(item.type)} />}
        />
    );
}

export default function ViewWorkoutScreen({ route, navigation }) {
    const { day } = route.params;
    // TEST
    const userId = '1234567890';
    const workoutDatabaseRef = Firebase.database().ref(`/users/${userId}/exercisePlan/${day}`);

    const [workout, setWorkout] = useState(null);
    const [initialWorkout, setInitialWorkout] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [navigationAction, setNavigationAction] = useState(false);    // The navigation action interrupted by the 'Save?' dialog
    const { colors } = useTheme();

    useEffect(() => {
        workoutDatabaseRef.on('value', snapshot => { 
            let value = snapshot.val(); 
            setInitialWorkout(value); 
            setWorkout(value); 
        });
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            if (JSON.stringify(workout) != JSON.stringify(initialWorkout)) {
                event.preventDefault();
                setNavigationAction(event.data.action);
                setDialogVisible(true);
            }
        });
        return unsubscribe;
    }, [navigation, workout, initialWorkout]);

    const onDialogDismiss = () => {
        setDialogVisible(false);
    };
    const onSaveChanges = () => {
        setDialogVisible(false);
        workoutDatabaseRef.set(workout);
        navigation.dispatch(navigationAction);
    };
    const onDiscardChanges = () => {
        setDialogVisible(false);
        navigation.dispatch(navigationAction);
    };
    const onCancelChanges = () => {
        setDialogVisible(false);
    }

    if (workout == null)
        return <LoadingScreen />;
    else {
        return (
            <View style={{ padding: 20 }}>
                <Headline style={{ textAlign: 'center', color: colors.primary }}>{workout.name}</Headline>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 8 }}>
                    <Text style={styles.descriptor}>{workout.time} mins</Text>
                    <Text style={styles.descriptor}>Level {workout.level}/5</Text>
                </View>
                <MultiDivider thickness={5} />
                <DraxList
                    data={workout.sequence}
                    renderItemContent={ExerciseItem}
                    keyExtractor={(item, index) => index.toString()}
                    onItemReorder={({ fromIndex, toIndex }) => {
                        const newWorkout = JSON.parse(JSON.stringify(workout));
                        newWorkout.sequence.splice(toIndex, 0, newWorkout.sequence.splice(fromIndex, 1)[0]);
                        setWorkout(newWorkout);
                      }}
                />
                <View style={{ width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <FAB icon='play' />
                </View>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={onDialogDismiss}>
                        <Dialog.Title>Save?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>You have made changes to your workout.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onSaveChanges}>Save</Button>
                            <Button color={colors.disabled} onPress={onDiscardChanges}>Don't save</Button>
                            <Button color={colors.disabled} onPress={onCancelChanges}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}