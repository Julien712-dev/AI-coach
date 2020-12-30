import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme, Headline, Subheading, Paragraph, Chip, Portal, Dialog } from 'react-native-paper';
import { Video } from 'expo-av';
import NumericInput from 'react-native-numeric-input';

import MultiDivider from '~/src/components/MultiDivider.js';
import DreamFeetVideo from '~/assets/video/dream-feet.mp4';

const styles = StyleSheet.create({
    chip: {
        marginRight: 3
    }
})

export default function ViewExerciseScreen({ route, navigation }) {
    const { day, index } = route.params;

    const exercise = useSelector(state => state.main.exercise.plan[day].sequence[index]);
    const dispatch = useDispatch();
    const { colors } = useTheme();

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Headline style={{ textAlign: 'center', color: colors.primary }}>{exercise.type}</Headline>
            <Video source={DreamFeetVideo} resizeMode='cover' style={{ width: 300, height: 300, marginVertical: 10 }} shouldPlay />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 8 }}>
            </View>
            <MultiDivider thickness={5} />
            <View style={{ width: '100%', marginTop: 5, flexDirection: 'row' }}>
                <Chip style={styles.chip} mode="contained">
                    Core
                </Chip>
                <Chip style={styles.chip} mode="contained">
                    Leg
                </Chip>
            </View>
            <View style={{ width: '100%', marginTop: 20 }}>
                <Subheading>Instructions</Subheading>
                <Paragraph>
                    1. It was the White Rabbit, trotting slowly back again.{`\n`}
                    2. “Mary Ann! Mary Ann!” said the voice. “Fetch me my gloves this moment!”{`\n`}
                    3. The Hatter was the first to break the silence. “What day of the month is it?” he said
                </Paragraph>
            </View>
            <TouchableOpacity onPress={() => console.log('test')}>
                <View style={{ marginTop: 60 }}>
                    <Text style={{ textAlign: 'center', fontSize: 40, color: colors.primary }}>40</Text>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: colors.primary }}>Times</Text>
                </View>
            </TouchableOpacity>
            {/* <Portal>
                <Dialog visible={dialogVisible} onDismiss={onDialogDismiss}>
                    <Dialog.Title>Save?</Dialog.Title>
                    <Dialog.Content>
                        <NumericInput />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onSaveChanges}>Save</Button>
                        <Button color={colors.disabled} onPress={onDiscardChanges}>Don't save</Button>
                        <Button color={colors.disabled} onPress={onCancelChanges}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal> */}
        </View>
    );
}