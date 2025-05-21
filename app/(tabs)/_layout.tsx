import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FloatingWorkoutButton } from '../components/FloatingWorkoutButton';
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

	console.log('Workout status:', {
		isWorkoutInProgress,
		workoutNameToResume,
		currentPath,
		showWorkoutBanner,
	});

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
						marginBottom: 8,
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

			{/* Remove the workout banner and keep only the floating action button */}
			{showWorkoutBanner && <FloatingWorkoutButton />}
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
});
