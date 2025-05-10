import { Stack, useRouter } from 'expo-router';
// Remove Animated and LayoutAnimation type if no longer used by a custom interpolator
// import { Animated } from 'react-native';
import React, { useEffect } from 'react';

// type LayoutAnimation = {
// 	current: { progress: Animated.AnimatedInterpolation<number> };
// 	next?: { progress: Animated.AnimatedInterpolation<number> };
// 	layouts: { screen: { width: number; height: number } };
// };

// const config = {
// 	animation: 'spring',
// 	config: {
// 		stiffness: 1000,
// 		damping: 500,
// 		mass: 3,
// 		overshootClamping: true,
// 		restDisplacementThreshold: 0.01,
// 		restSpeedThreshold: 0.01,
// 	},
// };

// const screenOptions = {
// 	headerShown: false,
// 	gestureEnabled: true,
// 	cardStyleInterpolator: ({ current, next, layouts }: LayoutAnimation) => {
// 		return {
// 			cardStyle: {
// 				transform: [
// 					{
// 						translateX: current.progress.interpolate({
// 							inputRange: [0, 1],
// 							outputRange: [layouts.screen.width, 0],
// 						}),
// 					},
// 				],
// 				opacity: current.progress.interpolate({
// 					inputRange: [0, 1],
// 					outputRange: [0, 1],
// 				}),
// 			},
// 			overlayStyle: {
// 				opacity: current.progress.interpolate({
// 					inputRange: [0, 1],
// 					outputRange: [0, 0.5],
// 				}),
// 			},
// 		};
// 	},
// 	transitionSpec: {
// 		open: config,
// 		close: config,
// 	},
// };

// Define a global user profile type
declare global {
	// eslint-disable-next-line no-var
	var userProfile:
		| {
				gender: string | null;
				birthDate: { month: string; day: string; year: string };
				weight: { value: string; unit: string };
				hasFitnessExperience: boolean | null;
				fitnessLevel: string;
		  }
		| Record<string, never>; // Allow empty object for initialization
	// eslint-disable-next-line no-var
	var currentOnboardingStep: number | undefined; // Allow undefined
}

export default function RootLayout() {
	const router = useRouter();

	useEffect(() => {
		// Initialize global variables if they aren't already set
		if (typeof global.userProfile === 'undefined') {
			global.userProfile = {}; // Initialize with an empty object
		}
		if (typeof global.currentOnboardingStep === 'undefined') {
			global.currentOnboardingStep = 1; // Or your desired default starting step
		}
	}, []);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				// gestureEnabled: true, // gestureEnabled is typically true by default with slide animations
				animation: 'slide_from_right', // Use slide_from_right animation
				contentStyle: { backgroundColor: 'black' }, // Changed from cardStyle to contentStyle
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="welcome" />
			<Stack.Screen name="login" />
			<Stack.Screen name="register" />
			<Stack.Screen name="loading" />
			<Stack.Screen name="onboarding" />
			<Stack.Screen name="(tabs)" />
		</Stack>
	);
}
