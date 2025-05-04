import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="birth-date" />
			<Stack.Screen name="weight" />
			<Stack.Screen name="experience" />
			<Stack.Screen name="fitness-level" />
		</Stack>
	);
}
