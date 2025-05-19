import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
	WorkoutStatusProvider,
	useWorkoutStatus,
} from '../contexts/WorkoutStatusContext';

// Create a wrapper component to use the context
function TabLayoutContent() {
	const { isWorkoutInProgress, workoutNameToResume } = useWorkoutStatus();
	const currentPath = usePathname();

	// Determine if we should show the workout banner
	// Only show if workout is in progress AND we're not on the track-workout screen
	const showWorkoutBanner =
		isWorkoutInProgress && !currentPath.includes('/track-workout');

	// Handler for Resume button - navigate to track-workout
	const handleResumeWorkout = () => {
		router.push('/(tabs)/track-workout');
	};

	// Handler for Discard button - navigate to track-workout with action param
	const handleDiscardWorkout = () => {
		router.push({
			pathname: '/(tabs)/track-workout',
			params: { action: 'discardFromLayout' },
		});
	};

	return (
		<>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false, // Hide labels
					tabBarActiveTintColor: '#0057ff', // Active tab white
					tabBarInactiveTintColor: '#8E8E93', // Inactive tab gray
					tabBarStyle: {
						backgroundColor: '#ffffff',
						borderTopWidth: 0,
						height: 60,
						paddingBottom: 5,
						marginBottom: showWorkoutBanner ? 8 : 8,
						marginHorizontal: 24,
						borderRadius: 16,
						overflow: 'hidden',
						position: 'absolute',
						bottom: 24,
						left: 24,
						right: 24,
						alignItems: 'center',
						justifyContent: 'center',
						shadowColor: '#000',
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5,
					},
					tabBarItemStyle: {
						paddingTop: 10,
						height: 60,
						alignItems: 'center',
						justifyContent: 'center',
					},
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: 'Home',
						tabBarIcon: ({ focused }) => (
							<View
								style={
									focused ? styles.activeIconContainer : styles.iconContainer
								}
							>
								<Feather
									name="home"
									color={focused ? '#0057ff' : '#8E8E93'}
									size={24}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="progress"
					options={{
						title: 'Progress',
						tabBarIcon: ({ focused }) => (
							<View
								style={
									focused ? styles.activeIconContainer : styles.iconContainer
								}
							>
								<MaterialCommunityIcons
									name="clipboard-text-outline"
									color={focused ? '#0057ff' : '#8E8E93'}
									size={24}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: 'Profile',
						tabBarIcon: ({ focused }) => (
							<View
								style={
									focused ? styles.activeIconContainer : styles.iconContainer
								}
							>
								<Feather
									name="user"
									color={focused ? '#0057ff' : '#8E8E93'}
									size={24}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="workouts"
					options={{
						title: 'Workouts',
						tabBarIcon: ({ focused }) => (
							<View
								style={
									focused ? styles.activeIconContainer : styles.iconContainer
								}
							>
								<MaterialCommunityIcons
									name="dumbbell"
									color={focused ? '#0057ff' : '#8E8E93'}
									size={24}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen name="track-workout" options={{ href: null }} />
			</Tabs>

			{/* Workout in progress banner - only show when not on track-workout screen */}
			{showWorkoutBanner && (
				<View style={styles.workoutBanner}>
					<View>
						<Text style={styles.workoutBannerTitle}>
							{workoutNameToResume || 'Workout in progress'}
						</Text>
					</View>
					<View style={styles.workoutBannerActions}>
						<TouchableOpacity
							style={styles.resumeButton}
							onPress={handleResumeWorkout}
						>
							<Text style={styles.resumeButtonText}>Resume</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleDiscardWorkout}>
							<Text style={styles.discardText}>Discard</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</>
	);
}

// Main export component that wraps with provider
export default function TabLayout() {
	return (
		<WorkoutStatusProvider>
			<TabLayoutContent />
		</WorkoutStatusProvider>
	);
}

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 40, // Ensure container is large enough for background
		height: 40, // Ensure container is large enough for background
		borderRadius: 8, // Rounded corners for the background
	},
	activeIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#E3FFA8', // Orange background for active tab
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	workoutBanner: {
		position: 'absolute',
		bottom: 95, // Changed from 120 to 90 to bring it closer to the bottom navigation
		left: 24,
		right: 24,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowColor: '#000', // Add shadow for better separation
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	workoutBannerTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
	},
	workoutBannerActions: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	resumeButton: {
		backgroundColor: '#FF5722',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		marginRight: 12,
	},
	resumeButtonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	discardText: {
		color: '#FF3B30',
		fontWeight: 'bold',
	},
});
