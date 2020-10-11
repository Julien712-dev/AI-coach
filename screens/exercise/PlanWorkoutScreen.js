import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme, IconButton, FAB, Text, Headline, Drawer, Card, Button } from 'react-native-paper';
import StarRating from 'react-native-star-rating';

const styles = StyleSheet.create({
    cell: {
        padding: 8,
        alignContent: 'center',
        justifyContent: 'center',
    }
});

function Row({ last, children }) {
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', minHeight: 50, borderColor: colors.border, borderBottomWidth: last ? 0 : 2 }}>
            <View style={{ ...styles.cell, flex: 1, borderColor: colors.border, borderRightWidth: 2 }}>
                {children ? children[0] : null}
            </View>
            <View style={{ ...styles.cell, flex: 3 }}>
                {children ? children[1] : null}
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

function ActivityCard({ type, name, level, time }) {
    const { colors } = useTheme();
    const title = type == 'rest' ? 'Rest' : name;
    return (
        <Card style={{ minHeight: 100 }}>
            <Card.Title title={title} />
            {type == 'rest' ? null :
                <Card.Content>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={level}
                        iconSet='Entypo'
                        fullStar='star'
                        emptyStar='star-outlined'
                        fullStarColor={colors.accent}
                        starSize={20}
                        containerStyle={{ justifyContent: 'flex-start' }}
                    />
                    <Drawer.Item icon='clock-outline' label={`${time} mins`} />
                </Card.Content>
            }
        </Card>
    );
}

export default function PlanWorkoutScreen({ navigation }) {
    return (
        <ScrollView style={{ padding: 20 }}>
            <Table>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Mon</Headline>
                    <ActivityCard type='workout' name='Core Workout' level={4} time={20}/>
                </Row>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Tue</Headline>
                    <ActivityCard type='workout' name='Arm Workout' level={3} time={16}/>
                </Row>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Wed</Headline>
                    <ActivityCard type='rest'/>
                </Row>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Thu</Headline>
                    <ActivityCard type='workout' name='Running' level={3} time={16}/>
                </Row>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Fri</Headline>
                    <ActivityCard type='workout' name='Leg Workout' level={3} time={16}/>
                </Row>
                <Row>
                    <Headline style={{ textAlign: 'center' }}>Sat</Headline>
                    <FAB icon='plus' label='Add'/>
                </Row>
            </Table>
        </ScrollView>
    );
}