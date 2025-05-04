import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

export default function ExperienceScreen() {
	const [gender, setGender] = useState<string | null>(null);

	useEffect(() => {
		// Set the current step to 4 and load any saved data
		global.currentOnboardingStep = 4;

		// Load gender from global state if available
		if (global.userProfile && global.userProfile.gender) {
			setGender(global.userProfile.gender);
		}
	}, []);

	const handleYesPressed = () => {
		// Update global state
		if (global.userProfile) {
			global.userProfile.hasFitnessExperience = true;
		} else {
			global.userProfile = {
				gender: gender,
				birthDate: { month: '', day: '', year: '' },
				weight: { value: '', unit: 'kg' },
				hasFitnessExperience: true,
				fitnessLevel: '',
			};
		}

		// Navigate directly to fitness level screen
		router.push('/onboarding/fitness-level');
	};

	const handleNoPressed = () => {
		// Update global state
		if (global.userProfile) {
			global.userProfile.hasFitnessExperience = false;
		} else {
			global.userProfile = {
				gender: gender,
				birthDate: { month: '', day: '', year: '' },
				weight: { value: '', unit: 'kg' },
				hasFitnessExperience: false,
				fitnessLevel: '',
			};
		}

		// Navigate to the next step
		router.push('/onboarding/fitness-level');
	};

	const goBack = () => {
		router.back();
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={goBack}>
					<AntDesign name="left" size={24} color="white" />
				</TouchableOpacity>

				<Text style={styles.stepText}>4 of 5 steps</Text>

				<TouchableOpacity
					onPress={() => router.push('/onboarding/fitness-level')}
				>
					<Text style={styles.skipText}>Skip</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>
					Do you have previous fitness experience?
				</Text>

				<View style={styles.imageContainer}>
					<Image
						source={
							gender === 'female'
								? require('../../assets/images/wroking-female.png')
								: require('../../assets/images/working-male.png')
						}
						style={styles.image}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						style={[styles.button, styles.noButton]}
						onPress={handleNoPressed}
					>
						<Text style={styles.buttonText}>No</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.yesButton]}
						onPress={handleYesPressed}
					>
						<Text style={styles.buttonText}>Yes</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginTop: 50,
		marginBottom: 20,
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
		padding: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginBottom: 40,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '80%',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 40,
	},
	button: {
		width: '48%',
		paddingVertical: 20,
		borderRadius: 15,
		alignItems: 'center',
	},
	noButton: {
		backgroundColor: '#444',
	},
	yesButton: {
		backgroundColor: '#FF6B00',
	},
	buttonText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
