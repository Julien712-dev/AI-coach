import * as React from 'react';
import { View } from 'react-native';
import { useTheme, Button, Text, Headline, Title, Paragraph, Card } from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';

export default function SettingsScreen({ navigation }) {
	const { colors } = useTheme();
	return (
		<View style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
			<ProgressCircle
				percent={30}
				radius={100}
				borderWidth={8}
				color={colors.primary}
				shadowColor={colors.border}
				bgColor={colors.background}
			>
				<Headline>567</Headline>
				<Text>out of 800</Text>
			</ProgressCircle>
			<Card style={{width: '100%', marginTop: 10}}>
				<Card.Title title="Analysis" />
				<Card.Content>
					<Paragraph>You are doing great so far! But try not to exercise immediately after lunch, which may hurt your intestine.</Paragraph>
				</Card.Content>
			</Card>
			<Card style={{width: '100%', marginTop: 10}}>
				<Card.Title title="Reminder" />
				<Card.Content>
					<Paragraph>A 20 minutes core workout on the schedule today!</Paragraph>
				</Card.Content>
				<Card.Actions>
					<Button>Start</Button>
					<Button color={colors.disabled}>Dismiss</Button>
				</Card.Actions>
			</Card>
			<Text></Text>
		</View>
	);
}