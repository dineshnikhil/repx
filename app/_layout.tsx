import { Stack } from 'expo-router';
import { Animated } from 'react-native';
import React from 'react';

// Define types for the animation parameters
type LayoutAnimation = {
	current: { progress: Animated.AnimatedInterpolation<number> };
	next?: { progress: Animated.AnimatedInterpolation<number> };
	layouts: { screen: { width: number; height: number } };
};

// Configure the default screen transition animations
const config = {
	animation: 'spring',
	config: {
		stiffness: 1000,
		damping: 500,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 0.01,
		restSpeedThreshold: 0.01,
	},
};

// Customize how screen transitions work
const screenOptions = {
	headerShown: false,
	gestureEnabled: true,
	cardStyleInterpolator: ({ current, next, layouts }: LayoutAnimation) => {
		return {
			cardStyle: {
				transform: [
					{
						translateX: current.progress.interpolate({
							inputRange: [0, 1],
							outputRange: [layouts.screen.width, 0],
						}),
					},
				],
				opacity: current.progress.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 1],
				}),
			},
			overlayStyle: {
				opacity: current.progress.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 0.5],
				}),
			},
		};
	},
	transitionSpec: {
		open: config,
		close: config,
	},
};

export default function RootLayout() {
	return (
		<Stack screenOptions={screenOptions}>
			<Stack.Screen name="index" />
			<Stack.Screen name="welcome" />
			<Stack.Screen name="login" />
			<Stack.Screen name="register" />
			<Stack.Screen name="loading" />
			<Stack.Screen name="onboarding" />
		</Stack>
	);
}
