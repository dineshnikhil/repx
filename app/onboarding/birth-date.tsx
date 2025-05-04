import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

// Declare global property type
declare global {
	var currentOnboardingStep: number | undefined;
}

export default function BirthDateScreen() {
	useEffect(() => {
		// Set the current step to 2 and navigate to the main onboarding screen
		global.currentOnboardingStep = 2;
		router.replace('/onboarding');
	}, []);

	return <View />;
}
