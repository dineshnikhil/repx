import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export default function LoadingScreen() {
	// Animation values
	const [percentage, setPercentage] = useState(0);
	const animatedValue = useRef(new Animated.Value(0)).current;
	const [buttonEnabled, setButtonEnabled] = useState(false);

	// Constants for the circle
	const CIRCLE_SIZE = 200;
	const STROKE_WIDTH = 15;
	const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
	const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	// Navigate to onboarding after animation completes
	useEffect(() => {
		// Animation duration in milliseconds
		const animationDuration = 2000;
		// Total steps for percentage (0-100)
		const totalSteps = 100;
		// Calculate interval for smooth percentage updates
		const updateInterval = animationDuration / totalSteps;
		
		// Start the counter animation synchronized with progress bar
		const timer = setInterval(() => {
			setPercentage((prev) => {
				const newPercentage = prev + 1;
				
				// Update the animated value to match the percentage
				animatedValue.setValue(newPercentage / 100);
				
				if (newPercentage >= 100) {
					clearInterval(timer);
					// Enable button only after reaching 100%
					setButtonEnabled(true);
					return 100;
				}
				return newPercentage;
			});
		}, updateInterval);

		return () => {
			clearInterval(timer);
		};
	}, []);

	// Calculate the stroke-dashoffset value based on the progress
	const progressStroke = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [CIRCLE_CIRCUMFERENCE, 0],
	});

	const handleStartTracking = () => {
		router.replace('/onboarding');
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<View style={styles.contentContainer}>
				<Text style={styles.title}>Creating your{'\n'}customized Profile</Text>

				<View style={styles.progressContainer}>
					<Svg
						width={CIRCLE_SIZE}
						height={CIRCLE_SIZE}
						viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
					>
						{/* Background circle */}
						<Circle
							cx={CIRCLE_SIZE / 2}
							cy={CIRCLE_SIZE / 2}
							r={RADIUS}
							strokeWidth={STROKE_WIDTH}
							stroke="#555"
							fill="transparent"
						/>

						{/* Progress circle */}
						<G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
							<AnimatedCircle
								cx={CIRCLE_SIZE / 2}
								cy={CIRCLE_SIZE / 2}
								r={RADIUS}
								strokeWidth={STROKE_WIDTH}
								stroke="#FF6B00"
								fill="transparent"
								strokeLinecap="round"
								strokeDasharray={CIRCLE_CIRCUMFERENCE}
								strokeDashoffset={progressStroke}
							/>
						</G>
					</Svg>

					{/* Percentage counter */}
					<Text style={styles.progressText}>{percentage}%</Text>
				</View>

				<Text style={styles.subtitle}>
					we are creating your profile, please hang on
				</Text>
			</View>

			<TouchableOpacity
				style={[styles.startButton, !buttonEnabled && styles.disabledButton]}
				onPress={handleStartTracking}
				disabled={!buttonEnabled}
			>
				<Text style={styles.startButtonText}>
					{buttonEnabled ? 'Start Tracking' : 'Please wait...'}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

// Create an animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 30,
		paddingBottom: 50,
	},
	disabledButton: {
		backgroundColor: '#666',
		opacity: 0.7,
	},
	contentContainer: {
		alignItems: 'center',
		width: '100%',
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginBottom: 80,
	},
	progressContainer: {
		width: 200,
		height: 200,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	progressText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: 'white',
		position: 'absolute',
	},
	subtitle: {
		fontSize: 16,
		color: '#888',
		marginTop: 80,
	},
	startButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 12,
		paddingVertical: 16,
		width: '100%',
		alignItems: 'center',
		marginTop: 'auto',
	},
	startButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
