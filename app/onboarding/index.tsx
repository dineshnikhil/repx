import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Step components
import BirthDateStep from './steps/BirthDateStep';
import ExperienceStep from './steps/ExperienceStep';
import FitnessLevelStep from './steps/FitnessLevelStep';
import GenderStep from './steps/GenderStep';
import WeightStep from './steps/WeightStep';

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

export default function OnboardingScreen() {
	// User data state
	const [userData, setUserData] = useState({
		gender: null as string | null,
		birthDate: { month: '', day: '', year: '' },
		weight: { value: '', unit: 'kg' },
		hasFitnessExperience: null as boolean | null,
		fitnessLevel: '',
	});

	// Current step state - initialize from global if available
	const [currentStep, setCurrentStep] = useState(
		global.currentOnboardingStep || 1
	);
	const totalSteps = 5;

	// Initialize global user profile if it doesn't exist
	useEffect(() => {
		if (!global.userProfile) {
			global.userProfile = { ...userData };
		} else {
			// If we have saved data, load it
			setUserData(global.userProfile);
		}

		// Reset the global step after we've used it
		global.currentOnboardingStep = undefined;
	}, []);

	// Helper function to update user data
	const updateUserData = (key: string, value: any) => {
		const updatedData = { ...userData, [key]: value };
		setUserData(updatedData);

		// Update global user profile
		global.userProfile = updatedData;
	};

	// Helper function to navigate to next step
	const goToNextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep((prev) => prev + 1);
		} else {
			// Complete onboarding and go to main app
			router.replace('/');
		}
	};

	// Helper function to navigate to previous step
	const goToPrevStep = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		} else {
			router.back();
		}
	};

	// Helper function to skip onboarding
	const skipOnboarding = () => {
		router.replace('/');
	};

	// Render the current step
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<GenderStep
						selectedGender={userData.gender}
						updateGender={(gender: string) => updateUserData('gender', gender)}
						onContinue={goToNextStep}
					/>
				);
			case 2:
				return (
					<BirthDateStep
						birthDate={userData.birthDate}
						updateBirthDate={(birthDate) =>
							updateUserData('birthDate', birthDate)
						}
						onContinue={goToNextStep}
					/>
				);
			case 3:
				return (
					<WeightStep
						weight={userData.weight}
						updateWeight={(weight) => updateUserData('weight', weight)}
						onContinue={goToNextStep}
					/>
				);
			case 4:
				return (
					<ExperienceStep
						gender={userData.gender}
						hasFitnessExperience={userData.hasFitnessExperience}
						updateExperience={(hasExperience) =>
							updateUserData('hasFitnessExperience', hasExperience)
						}
						onContinue={goToNextStep}
					/>
				);
			case 5:
				return (
					<FitnessLevelStep
						fitnessLevel={userData.fitnessLevel}
						updateFitnessLevel={(level) =>
							updateUserData('fitnessLevel', level)
						}
						onContinue={goToNextStep}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={goToPrevStep}>
					<AntDesign name="left" size={24} color="white" />
				</TouchableOpacity>

				<Text style={styles.stepText}>
					{currentStep} of {totalSteps} steps
				</Text>

				<TouchableOpacity onPress={skipOnboarding}>
					<Text style={styles.skipText}>Skip</Text>
				</TouchableOpacity>
			</View>

			{renderStep()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		paddingHorizontal: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 50,
		marginBottom: 20,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
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
});
