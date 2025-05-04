import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Declare global property type
declare global {
	var currentOnboardingStep: number | undefined;
	var userProfile: {
		gender: string | null;
		birthDate: { month: string; day: string; year: string };
		weight: { value: string; unit: string };
		hasFitnessExperience: boolean | null;
		fitnessLevel: string;
	};
}

export default function FitnessLevelScreen() {
	const [selectedLevel, setSelectedLevel] = useState<string>('beginner');

	useEffect(() => {
		// Set the current step to 5
		global.currentOnboardingStep = 5;

		// Load fitness level from global state if available
		if (global.userProfile && global.userProfile.fitnessLevel) {
			setSelectedLevel(global.userProfile.fitnessLevel);
		}
	}, []);

	const handleLevelSelect = (level: string) => {
		setSelectedLevel(level);

		// Update global state
		if (global.userProfile) {
			global.userProfile.fitnessLevel = level;
		}
	};

	const handleNextStep = () => {
		// Update global profile with selected fitness level
		if (global.userProfile) {
			global.userProfile.fitnessLevel = selectedLevel;
		}

		// Navigate to dashboard/home
		router.replace('/');
	};

	const goBack = () => {
		router.back();
	};

	const handleSkip = () => {
		// Skip to dashboard/home
		router.replace('/');
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={goBack}>
					<AntDesign name="left" size={24} color="white" />
				</TouchableOpacity>

				<Text style={styles.stepText}>5 of 5 steps</Text>

				<TouchableOpacity onPress={handleSkip}>
					<Text style={styles.skipText}>Skip</Text>
				</TouchableOpacity>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<Text style={styles.title}>What's your fitness level?</Text>

				<View style={styles.levelsContainer}>
					<TouchableOpacity
						style={[
							styles.levelButton,
							selectedLevel === 'beginner' && styles.selectedLevel,
						]}
						onPress={() => handleLevelSelect('beginner')}
					>
						<Text
							style={[
								styles.levelText,
								selectedLevel === 'beginner' && styles.selectedLevelText,
							]}
						>
							Beginner
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.levelButton,
							selectedLevel === 'intermediate' && styles.selectedLevel,
						]}
						onPress={() => handleLevelSelect('intermediate')}
					>
						<Text style={styles.levelText}>Intermediate</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.levelButton,
							selectedLevel === 'advanced' && styles.selectedLevel,
						]}
						onPress={() => handleLevelSelect('advanced')}
					>
						<Text style={styles.levelText}>Advance</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Next button */}
			<TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
				<Text style={styles.nextButtonText}>Next Step</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		paddingBottom: 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginTop: 50,
		marginBottom: 40,
	},
	backButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#1C1C1E',
		justifyContent: 'center',
		alignItems: 'center',
	},
	stepText: {
		color: '#888',
		fontSize: 16,
	},
	skipText: {
		color: '#888',
		fontSize: 16,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginBottom: 80,
	},
	levelsContainer: {
		gap: 20,
	},
	levelButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 15,
		paddingVertical: 25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedLevel: {
		borderColor: '#FF6B00',
		borderWidth: 2,
	},
	levelText: {
		color: 'white',
		fontSize: 20,
		fontWeight: '500',
	},
	selectedLevelText: {
		color: '#FF6B00',
	},
	nextButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 12,
		marginHorizontal: 20,
		paddingVertical: 18,
		alignItems: 'center',
		marginTop: 'auto',
	},
	nextButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});
