import * as React from 'react';
import moment from 'moment';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Text, Card, Title, Paragraph } from 'react-native-paper';


export default function DietScreenMain({ navigation }) {

	const [time, setTime] = React.useState();
	React.useEffect(() => {
		let currentTime = new Date();
		setTime(currentTime);
	}, [])

	return (
		// <SafeAreaView>
			<ScrollView>
				<Title>{moment(time).format('LLLL')}</Title>
				<Button mode='contained' onPress={() => navigation.navigate('Edit Diet')}>
					Edit Diet
				</Button>
				<Title>Explore</Title>
				<Card>
					<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
					<Card.Content>
						<Title>Card title</Title>
						<Paragraph>Card content</Paragraph>
					</Card.Content>
					<Card.Actions>
						<Button>OK</Button>
					</Card.Actions>
				</Card>
				<Card>
					<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
					<Card.Content>
						<Title>Card title 2</Title>
						<Paragraph>Card content 2</Paragraph>
					</Card.Content>
					<Card.Actions>
						<Button>OK</Button>
					</Card.Actions>
				</Card>
			</ScrollView>
		// </SafeAreaView>
	);
}

const styles = StyleSheet.create({
	card: {
		width: 0.4,
		height: 50
	}
});