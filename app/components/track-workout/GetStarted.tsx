import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GetStartedProps {
	goToSearchScreen: () => void;
	discardWorkout: () => void;
}

export const GetStarted: React.FC<GetStartedProps> = ({
	goToSearchScreen,
	discardWorkout,
}) => {
	return (
		<View style={styles.getStartedOuterContainer}>
			<View style={styles.workoutContent}>
				<View style={styles.dumbellIconContainer}>
					<Feather name="hexagon" size={80} color="#666" />
					<MaterialCommunityIcons
						name="dumbbell"
						size={40}
						color="#888"
						style={styles.dumbellIcon}
					/>
				</View>
				<Text style={styles.getStartedText}>Get Started</Text>
				<Text style={styles.instructionText}>
					Add an exercise to start your workout
				</Text>
			</View>
			<View style={styles.actionButtonsContainer}>
				<TouchableOpacity style={styles.addButton} onPress={goToSearchScreen}>
					<Text style={styles.addButtonText}>+ Add Exercise</Text>
				</TouchableOpacity>
				<View style={styles.bottomActions}>
					<TouchableOpacity style={styles.settingsButton}>
						<Text style={styles.settingsText}>Settings</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.discardButton}
						onPress={discardWorkout}
					>
						<Text style={styles.discardText}>Discard Workout</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	getStartedOuterContainer: {
		flex: 1,
		justifyContent: 'space-between',
		paddingBottom: 20,
	},
	workoutContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dumbellIconContainer: {
		position: 'relative',
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dumbellIcon: {
		position: 'absolute',
	},
	getStartedText: {
		color: 'white',
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	instructionText: {
		color: '#999',
		fontSize: 16,
		textAlign: 'center',
	},
	actionButtonsContainer: {
		paddingBottom: 20,
	},
	addButton: {
		backgroundColor: '#FF5722',
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		marginBottom: 24,
	},
	addButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	bottomActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	settingsButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		width: '48%',
		alignItems: 'center',
		padding: 16,
	},
	settingsText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	discardButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		width: '48%',
		alignItems: 'center',
		padding: 16,
	},
	discardText: {
		color: '#FF3B30',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
