import { Stack } from 'expo-router';
// Remove Animated and LayoutAnimation type if no longer used by a custom interpolator
// import { Animated } from 'react-native';
import React from 'react';

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

export default function RootLayout() {
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
			<Stack.Screen name="profile" />
			<Stack.Screen name="home" />
		</Stack>
	);
}
