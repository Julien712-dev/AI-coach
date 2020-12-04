import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { useTheme, FAB, Text, Headline, List } from 'react-native-paper';
import { DraxList } from 'react-native-drax';

import { swapExercise } from '../../store/exerciseSlice';
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

    const workout = useSelector(state => state.main.exercise.plan[day]);
    const dispatch = useDispatch();
    const { colors } = useTheme();

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
                    onItemReorder={({ fromIndex, toIndex }) => dispatch(swapExercise({ day, fromIndex, toIndex }))}
                />
                <View style={{ width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <FAB icon='play' />
                </View>
            </View>
        );
    }
}