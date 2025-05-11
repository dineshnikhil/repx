import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DumbbellIcon } from './Icons';

type WorkoutCardProps = {
	name: string;
	date: string;
	exerciseCount: number;
};

const WorkoutCard = ({ name, date, exerciseCount }: WorkoutCardProps) => {
	return (
		<View style={styles.card}>
			<View style={styles.cardContent}>
				<View>
					<Text style={styles.workoutName}>{name}</Text>
					<Text style={styles.subtitle}>comes till here now</Text>
				</View>
				<Text style={styles.date}>{date}</Text>
			</View>
			<View style={styles.exerciseContainer}>
				<DumbbellIcon />
				<Text style={styles.exerciseCount}>{exerciseCount} Exercises</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#E8F0FF',
		borderRadius: 16,
		padding: 20,
		marginVertical: 10,
		width: '100%',
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 20,
	},
	workoutName: {
		color: '#272C36',
		fontSize: 24,
		fontWeight: 'bold',
	},
	subtitle: {
		color: '#272C36',
		fontSize: 18,
		opacity: 0.8,
		marginTop: 5,
	},
	date: {
		color: '#A1A8B4',
		fontSize: 16,
	},
	exerciseContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	exerciseCount: {
		color: '#A1A8B4',
		fontSize: 16,
		marginLeft: 8,
	},
});

export default WorkoutCard;
