import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useWorkoutStatus } from '../contexts/WorkoutStatusContext';

export const FloatingWorkoutButton = () => {
	const { isWorkoutInProgress, workoutNameToResume } = useWorkoutStatus();
	const [expanded, setExpanded] = useState(false);
	const [animation] = useState(new Animated.Value(0));
	const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	// Don't render if no workout in progress
	if (!isWorkoutInProgress) {
		return null;
	}

	const handleResumeWorkout = () => {
		router.push('/(tabs)/track-workout');
	};

	const handleDiscardWorkout = () => {
		router.push({
			pathname: '/(tabs)/track-workout',
			params: { action: 'discardFromLayout' },
		});
	};

	const toggleExpand = () => {
		const toValue = expanded ? 0 : 1;

		// Clear any existing timer when toggle is pressed
		if (autoCollapseTimerRef.current) {
			clearTimeout(autoCollapseTimerRef.current);
			autoCollapseTimerRef.current = null;
		}

		Animated.timing(animation, {
			toValue,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.ease,
		}).start();

		setExpanded(!expanded);

		// Set a timer to auto-collapse if expanded
		if (!expanded) {
			autoCollapseTimerRef.current = setTimeout(() => {
				collapseButton();
			}, 4000); // Auto-collapse after 4 seconds of inactivity
		}
	};

	// Function to collapse the button
	const collapseButton = () => {
		if (expanded) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
				easing: Easing.ease,
			}).start();

			setExpanded(false);
		}

		if (autoCollapseTimerRef.current) {
			clearTimeout(autoCollapseTimerRef.current);
			autoCollapseTimerRef.current = null;
		}
	};

	// Clean up timer when component unmounts
	useEffect(() => {
		return () => {
			if (autoCollapseTimerRef.current) {
				clearTimeout(autoCollapseTimerRef.current);
			}
		};
	}, []);

	const discardTranslateY = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -60],
	});

	const discardOpacity = animation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, 0, 1],
	});

	return (
		<View style={styles.container}>
			{/* Discard Button (animated) */}
			<Animated.View
				style={[
					styles.discardButton,
					{
						transform: [{ translateY: discardTranslateY }],
						opacity: discardOpacity,
					},
				]}
			>
				<TouchableOpacity
					style={styles.discardButtonInner}
					onPress={handleDiscardWorkout}
					activeOpacity={0.9}
				>
					<Ionicons name="trash-outline" size={20} color="white" />
				</TouchableOpacity>
			</Animated.View>

			{/* Main Button */}
			<TouchableOpacity
				style={styles.floatingButton}
				onPress={expanded ? handleResumeWorkout : toggleExpand}
				onLongPress={toggleExpand}
				activeOpacity={0.9}
			>
				<View style={styles.buttonContent}>
					<Ionicons
						name={expanded ? 'barbell-outline' : 'ellipsis-horizontal'}
						size={24}
						color="white"
						style={styles.icon}
					/>
					<Text style={styles.buttonText}>
						{expanded ? 'Resume' : workoutNameToResume || 'Workout'}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 90,
		right: 24,
		alignItems: 'center',
		zIndex: 1000,
	},
	floatingButton: {
		backgroundColor: '#FF5722',
		borderRadius: 28,
		paddingVertical: 12,
		paddingHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: 8,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	discardButton: {
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	discardButtonInner: {
		backgroundColor: '#FF3B30',
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
