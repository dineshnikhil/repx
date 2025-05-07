import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FitnessLevelStepProps {
	fitnessLevel: string;
	updateFitnessLevel: (level: string) => void;
	onContinue: () => void;
}

const FitnessLevelStep: React.FC<FitnessLevelStepProps> = ({
	fitnessLevel,
	updateFitnessLevel,
	onContinue,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>What's your fitness level?</Text>

			<View style={styles.levelsContainer}>
				<TouchableOpacity
					style={[
						styles.levelButton,
						fitnessLevel === 'beginner' ? styles.selectedLevel : {},
					]}
					onPress={() => updateFitnessLevel('beginner')}
				>
					<Text style={styles.levelText}>Beginner</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.levelButton,
						fitnessLevel === 'intermediate' ? styles.selectedLevel : {},
					]}
					onPress={() => updateFitnessLevel('intermediate')}
>
					<Text style={styles.levelText}>Intermediate</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.levelButton,
						fitnessLevel === 'advanced' ? styles.selectedLevel : {},
					]}
					onPress={() => updateFitnessLevel('advanced')}
				>
					<Text style={styles.levelText}>Advance</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.continueButton} onPress={onContinue}>
				<Text style={styles.continueText}>Next Step</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 100,
		marginBottom: 50,
	},
	levelsContainer: {
		paddingHorizontal: 20,
		gap: 20,
	},
	levelButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 15,
		paddingVertical: 25,
		alignItems: 'center',
	},
	selectedLevel: {
		borderColor: '#E84118',
		borderWidth: 2,
	},
	levelText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	continueButton: {
		backgroundColor: '#E84118',
		borderRadius: 30,
		marginHorizontal: 20,
		paddingVertical: 18,
		alignItems: 'center',
		marginBottom: 40,
	},
	continueText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default FitnessLevelStep;
