import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router'; // Add this import

interface FitnessLevelStepProps {
	fitnessLevel: string;
	updateFitnessLevel: (level: string) => void;
	onContinue: () => void; // This prop might be directly calling router.push or similar
}

const FitnessLevelStep: React.FC<FitnessLevelStepProps> = ({
	fitnessLevel,
	updateFitnessLevel,
	onContinue, // We will modify how this is called or what it does
}) => {
	const handleContinue = () => {
		// Navigate to the new home screen
		router.replace('/home'); // Or router.push('/home') depending on desired stack behavior
		// If onContinue has other responsibilities, call it before or after navigation
		// onContinue(); 
	};

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

			<TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
		marginBottom: 0,
	},
	levelsContainer: {
		paddingHorizontal: 20,
		gap: 20,
		marginBottom: 70,
	},
	levelButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		paddingVertical: 20,
		alignItems: 'center',
	},
	selectedLevel: {
		borderColor: '#E84118',
		borderWidth: 2,
	},
	levelText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	continueButton: {
		backgroundColor: '#E84118',
		borderRadius: 12,
		marginHorizontal: 20,
		paddingVertical: 16,
		alignItems: 'center',
		marginBottom: 40,
	},
	continueText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default FitnessLevelStep;
