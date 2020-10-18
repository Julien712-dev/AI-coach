import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function LoadingScreen() {
    return (
        <View style={{ height: '100%', justifyContent: 'center' }}>
            <ActivityIndicator size='large' />
        </View>
    );
}