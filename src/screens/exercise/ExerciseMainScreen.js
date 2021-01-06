import * as React from 'react';
import { useSelector } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { useTheme, Button, FAB, Text, Headline, Paragraph, Card } from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';
import { getDayOfWeek } from '~/src/Util';

function AnalysisCard({ key }) {
	return (
		<Card key={key} style={{ width: '100%', marginTop: 10 }}>
			<Card.Title title='Analysis' />
			<Card.Content>
				<Paragraph>You are doing great so far! But try not to exercise immediately after lunch, which may hurt your intestine.</Paragraph>
			</Card.Content>
		</Card>
	);
}

function WorkoutReminderCard({ key, workout }) {
	const { colors } = useTheme();
	return (
		<Card key={key} style={{ width: '100%', marginTop: 10 }}>
			<Card.Title title='Reminder' />
			<Card.Content>
				<Paragraph>A {workout.time} minutes {workout.name} on the schedule today!</Paragraph>
			</Card.Content>
			<Card.Actions>
				<Button>Start</Button>
				<Button color={colors.disabled}>Dismiss</Button>
			</Card.Actions>
		</Card>
	);
}

export default function ExerciseMainScreen({ navigation }) {
	const workoutToday = useSelector(state => state.main.exercise.plan[getDayOfWeek()]);
	const { colors } = useTheme();

	let cards = [<AnalysisCard key='analysis' />];
	if (workoutToday.type == 'workout')
		cards.push(<WorkoutReminderCard key='workout-reminder' workout={workoutToday} />)

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
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
			{cards}
			<View style={{ width: '100%', marginTop: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
				<FAB icon='plus' />
				<FAB icon='play' />
				<FAB icon='pencil' onPress={() => navigation.navigate('Workout Plan')} />
			</View>
		</ScrollView>
	);
}