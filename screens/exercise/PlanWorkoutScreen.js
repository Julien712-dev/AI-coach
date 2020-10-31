import React, { useState, useEffect } from 'react';
import Firebase from 'firebase';
import { StyleSheet, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useTheme, FAB, Headline, Text, IconButton, Surface, Title, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import LoadingScreen from '../LoadingScreen';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const styles = StyleSheet.create({
    cell: {
        padding: 8,
        alignContent: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        margin: 0
    }
});

function IconButtonWithoutFeedback(props) {
    return (
        <TouchableWithoutFeedback>
            <TouchableOpacity>
                <IconButton {...props} />
            </TouchableOpacity>
        </TouchableWithoutFeedback>
    );
}

function Row({ last, header, children }) {
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', minHeight: 50, borderColor: colors.border, borderBottomWidth: last ? 0 : 2 }}>
            <View style={{ ...styles.cell, flex: 1, borderColor: colors.border, borderRightWidth: 2 }}>
                <Headline style={{ textAlign: 'center' }}>{header}</Headline>
            </View>
            <View style={{ ...styles.cell, flex: 3 }}>
                {children}
            </View>
        </View>
    );
}

function Table({ children }) {
    return (
        <View style={{ width: '100%' }}>
            <Row />
            {children}
            <Row last={true} />
        </View>
    );
}

function ActivityCard({ activity, onPress, onMoveUp, onMoveDown, onDelete }) {
    const { colors } = useTheme();
    const title = <Title>{activity.type == 'rest' ? 'Rest' : activity.name}</Title>;
    const content = activity.type == 'rest' ? null : (
        <View>
            <StarRating
                disabled={true}
                maxStars={5}
                rating={activity.level}
                iconSet='Entypo'
                fullStar='star'
                emptyStar='star-outlined'
                fullStarColor={colors.accent}
                starSize={20}
                containerStyle={{ justifyContent: 'flex-start', marginLeft: 7 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon='clock-outline' style={styles.iconButton} />
                <Text>{activity.time} mins</Text>
            </View>
        </View>
    );
    return (
        <TouchableOpacity onPress={onPress}>
            <Surface style={{ minHeight: 100, paddingHorizontal: 10, paddingVertical: 2, flexDirection: 'row', justifyContent: 'space-between', elevation: 5, borderRadius: 7 }}>
                <View>
                    {title}
                    {content}
                </View>
                <View>
                    <IconButtonWithoutFeedback icon='chevron-up' style={styles.iconButton} color={colors.primary} onPress={onMoveUp} />
                    <IconButtonWithoutFeedback icon='delete' style={styles.iconButton} color={colors.disabled} onPress={onDelete} />
                    <IconButtonWithoutFeedback icon='chevron-down' style={styles.iconButton} color={colors.primary} onPress={onMoveDown} />
                </View>
            </Surface>
        </TouchableOpacity>
    );
}

export default function PlanWorkoutScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [initialUser, setInitialUser] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [navigationAction, setNavigationAction] = useState(false);    // The navigation action interrupted by the 'Save?' dialog
    const { colors } = useTheme();

    // TEST
    const userId = '1234567890';

    const userDatabaseRef = Firebase.database().ref(`/users/${userId}`);

    useEffect(() => {
        userDatabaseRef.on('value', snapshot => { 
            let value = snapshot.val();
            setInitialUser(value);
            setUser(value); 
        });
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            if (JSON.stringify(user) != JSON.stringify(initialUser)) {
                event.preventDefault();
                setNavigationAction(event.data.action);
                setDialogVisible(true);
            }
        });
        return unsubscribe;
    }, [navigation, user, initialUser]);

    if (user == null)
        return <LoadingScreen />;
    else {
        const onActivityPress = day => {
            const activity = user.exercisePlan[day];
            if (activity.type != 'rest')
                navigation.navigate('View Workout', { day: day })
        };
        const onActivityMoveUp = day => {
            let userClone = JSON.parse(JSON.stringify(user));
            const index = days.indexOf(day);

            if (index > 0) {
                let temp = user.exercisePlan[days[index - 1]];
                userClone.exercisePlan[days[index - 1]] = userClone.exercisePlan[days[index]];
                userClone.exercisePlan[days[index]] = temp;
                setUser(userClone);
            }
        };
        const onActivityMoveDown = day => {
            let userClone = JSON.parse(JSON.stringify(user));
            const index = days.indexOf(day);

            if (index < days.length - 1) {
                let temp = user.exercisePlan[days[index + 1]];
                userClone.exercisePlan[days[index + 1]] = userClone.exercisePlan[days[index]];
                userClone.exercisePlan[days[index]] = temp;
                setUser(userClone);
            }
        };
        const onActivityDelete = day => {
            let userClone = JSON.parse(JSON.stringify(user));
            const index = days.indexOf(day);
            delete userClone.exercisePlan[days[index]];
            setUser(userClone);
        };
        const onDialogDismiss = () => {
            setDialogVisible(false);
        };
        const onSaveChanges = () => {
            setDialogVisible(false);
            userDatabaseRef.set(user);
            navigation.dispatch(navigationAction);
        };
        const onDiscardChanges = () => {
            setDialogVisible(false);
            navigation.dispatch(navigationAction);
        };
        const onCancelChanges = () => {
            setDialogVisible(false);
        }
        const rows = days.map(day => {
            const header = day[0].toUpperCase() + day.slice(1);
            const activity = user.exercisePlan[day];
            const component = activity == undefined ?
                <FAB icon='plus' label='Add' /> :
                <ActivityCard activity={activity} onPress={() => onActivityPress(day)} onMoveUp={() => onActivityMoveUp(day)} onMoveDown={() => onActivityMoveDown(day)} onDelete={() => onActivityDelete(day)} />;
            return (
                <Row key={day} header={header}>
                    {component}
                </Row>
            );
        });
        return (
            <ScrollView style={{ padding: 20 }}>
                <Table>
                    {rows}
                </Table>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={onDialogDismiss}>
                        <Dialog.Title>Save?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>You have made changes to your workout plan.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onSaveChanges}>Save</Button>
                            <Button color={colors.disabled} onPress={onDiscardChanges}>Don't save</Button>
                            <Button color={colors.disabled} onPress={onCancelChanges}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        );
    }
}