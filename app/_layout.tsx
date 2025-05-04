import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="welcome" options={{ headerShown: false }} />
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="register" options={{ headerShown: false }} />
			<Stack.Screen name="loading" options={{ headerShown: false }} />
			<Stack.Screen name="onboarding" options={{ headerShown: false }} />
		</Stack>
	);
}
