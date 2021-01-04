import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Headline, Subheading, Paragraph, Chip, Portal, Dialog, Text } from 'react-native-paper';
import { Video } from 'expo-av';
import NumericInput from 'react-native-numeric-input';

import { changeExerciseLength } from '~/src/store/exerciseSlice';
import MultiDivider from '~/src/components/MultiDivider';

export default function ViewExerciseScreen({ route, navigation }) {
    const { day, index } = route.params;

    const [dialogVisible, setDialogVisible] = useState(false);
    const exerciseType = useSelector(state => state.main.exercise.plan[day].sequence[index].type);
    const exerciseLength = useSelector(state => state.main.exercise.plan[day].sequence[index].length);
    const exerciseLengthType = useSelector(state => state.main.exercise.plan[day].sequence[index].lengthType);
    const exerciseDescription = useSelector(state => state.main.exercise.library[exerciseType]);
    const dispatch = useDispatch();
    const { colors } = useTheme();

    const labels = exerciseDescription.labels.map((label, index) => <Chip key={index.toString()} style={{ marginRight: 3 }} mode="contained">{label}</Chip>);
    const instructions = exerciseDescription.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');

    const onPressLength = () => { setDialogVisible(true); }
    const onDialogDismiss = () => { setDialogVisible(false); }
    const onChangeLength = length => dispatch(changeExerciseLength({ day, index, length }));

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Headline style={{ textAlign: 'center', color: colors.primary }}>{exerciseType}</Headline>
            <Video
                source={exerciseDescription.video}
                resizeMode='cover'
                style={{ width: 300, height: 300, marginVertical: 10 }}
                shouldPlay
            />
            <MultiDivider thickness={5} />
            <View style={{ width: '100%', marginTop: 5, flexDirection: 'row' }}>
                {labels}
            </View>
            <View style={{ width: '100%', marginTop: 20 }}>
                <Subheading>Instructions</Subheading>
                <Paragraph>{instructions}</Paragraph>
            </View>
            <TouchableOpacity onPress={onPressLength}>
                <View style={{ marginTop: 60 }}>
                    <Text style={{ textAlign: 'center', fontSize: 40, color: colors.primary }}>{exerciseLength}</Text>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: colors.primary }}>{exerciseLengthType}</Text>
                </View>
            </TouchableOpacity>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={onDialogDismiss}>
                    <Dialog.Content style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <NumericInput
                                editable={true}
                                value={exerciseLength}
                                minValue={1}
                                onChange={onChangeLength}
                            />
                            <Text style={{ fontSize: 22, marginLeft: 5 }}>{exerciseLengthType}</Text>
                        </View>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
}