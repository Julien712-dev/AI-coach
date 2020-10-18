import React from 'react';
import * as Firebase from 'firebase';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme, ActivityIndicator, FAB, Headline, Drawer, Card, Text } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import LoadingScreen from '../LoadingScreen';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const styles = StyleSheet.create({
    cell: {
        padding: 8,
        alignContent: 'center',
        justifyContent: 'center',
    }
});

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

function ActivityCard({ activity, onPress }) {
    const { colors } = useTheme();
    const title = activity.type == 'rest' ? 'Rest' : activity.name;
    return (
        <Card style={{ minHeight: 100 }} onPress={onPress}>
            <Card.Title title={title} />
            {activity.type == 'rest' ? null :
                <Card.Content>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={activity.level}
                        iconSet='Entypo'
                        fullStar='star'
                        emptyStar='star-outlined'
                        fullStarColor={colors.accent}
                        starSize={20}
                        containerStyle={{ justifyContent: 'flex-start' }}
                    />
                    <Drawer.Item icon='clock-outline' label={`${activity.time} mins`} />
                </Card.Content>
            }
        </Card>
    );
}

export default function PlanWorkoutScreen({ navigation }) {
    const [loaded, setLoaded] = React.useState(false);
    const [user, setUser] = React.useState(null);

    // TEST
    const userId = '1234567890';

    if (!loaded) {
        Firebase.database().ref(`/users/${userId}`).on('value', snapshot => {
            setUser(snapshot.val());
            setLoaded(true);
        });
        return <LoadingScreen/>;
    } else {
        const onActivityPress = day => {
            const activity = user.exercisePlan[day];
            if (activity.type != 'rest')
                navigation.navigate('View Workout', { day: day })
        };
        const rows = days.map(day => {
            const header = day[0].toUpperCase() + day.slice(1);
            const activity = user.exercisePlan[day];
            const component = activity == undefined ? 
                <FAB icon='plus' label='Add'/> :
                <ActivityCard activity={activity} onPress={() => onActivityPress(day)}/>;
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
            </ScrollView>
        );
    }
}