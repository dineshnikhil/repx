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

// Global types are defined in app/_layout.tsx

export default function OnboardingScreen() {
	// User data state - initialize from global.userProfile or default
	const [userData, setUserData] = useState(() => {
		const defaultData = {
			gender: null as string | null,
			birthDate: { month: '', day: '', year: '' },
			weight: { value: '', unit: 'kg' },
			hasFitnessExperience: null as boolean | null,
			fitnessLevel: '',
		};
		// Check if global.userProfile is defined and not an empty object
		if (global.userProfile && Object.keys(global.userProfile).length > 0) {
			return global.userProfile as typeof defaultData; // Use as to assert the type
		}
		return defaultData;
	});

	// Current step state - initialize from global if available
	const [currentStep, setCurrentStep] = useState(
		global.currentOnboardingStep || 1
	);
	const totalSteps = 5;

	useEffect(() => {
		// Sync userData with global.userProfile, primarily for initialization
		// and ensuring global.userProfile gets populated if it was initially empty.
		if (!global.userProfile || Object.keys(global.userProfile).length === 0) {
			global.userProfile = { ...userData };
		} else {
			// If global.userProfile exists and is different from component state, update component state
			// This handles cases where global.userProfile might have been populated from elsewhere (e.g., async storage in future)
			if (JSON.stringify(global.userProfile) !== JSON.stringify(userData)) {
				setUserData(global.userProfile as any); // Keep as any or use the specific type
			}
		}

		// Reset the global step value after using it for initialization
		if (global.currentOnboardingStep) {
			global.currentOnboardingStep = undefined;
		}
	}, []); // Run once on mount

	// Helper function to update user data and global profile
	const updateUserData = (key: string, value: any) => {
		setUserData((prevData) => {
			const updatedData = { ...prevData, [key]: value };
			global.userProfile = updatedData; // Keep global.userProfile in sync
			return updatedData;
		});
	};

	// Helper function to navigate to next step
	const goToNextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep((prev) => prev + 1);
		} else {
			// Complete onboarding and go to main app
			console.log('Onboarding complete. Profile:', global.userProfile);
			router.replace('/home');
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
		console.log('Onboarding skipped. Navigating to /home');
		router.replace('/home');
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
		paddingHorizontal: 15,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 70,
		marginBottom: 20,
	},
	backButton: {
		width: 45,
		height: 45,
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
});
