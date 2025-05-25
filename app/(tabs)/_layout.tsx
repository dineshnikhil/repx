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

	const showWorkoutBanner =
		isWorkoutInProgress && !currentPath.includes('/track-workout');

	console.log('TabLayout workout status:', {
		isWorkoutInProgress,
		workoutNameToResume,
		currentPath,
		showWorkoutBanner,
		pathCheck: !currentPath.includes('/track-workout'),
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
					tabBarActiveTintColor: '#FFFFFF', // Color of the active icon (white on orange background)
					tabBarInactiveTintColor: '#8E8E93', // Color of the inactive icon
					tabBarStyle: {
						position: 'absolute',
						bottom: 0, // Stick to bottom
						left: 0, // Full width
						right: 0, // Full width
						backgroundColor: '#111010', // Black background for the tab bar
						borderRadius: 0, // No border radius for a bottom-fixed bar
						height: 70, // Height of the tab bar
						borderTopWidth: 0, // No top border
						// paddingTop: 10,
						// Removed shadow properties as it's no longer floating
					},
					tabBarItemStyle: {
						height: '100%', // Icons take full height of the item
						alignItems: 'center',
						justifyContent: 'center',
						paddingTop: 10, // Shift icons down a bit
					},
				}}
			>
				<Tabs.Screen // 1. Home
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
									color={focused ? '#FFFFFF' : '#8E8E93'} // White on active, grey on inactive
									size={28}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen // 2. Workouts (Dumbbell) - Moved up
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
									color={focused ? '#FFFFFF' : '#8E8E93'} // White on active, grey on inactive
									size={28}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen // 3. Progress (Gauge/Chart) - Icon changed
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
									name="gauge" // Changed to 'gauge' or similar to match image
									color={focused ? '#FFFFFF' : '#8E8E93'} // White on active, grey on inactive
									size={28}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen // 4. Profile
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
									color={focused ? '#FFFFFF' : '#8E8E93'} // White on active, grey on inactive
									size={28}
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
		// For inactive icons & active icon wrapper
		justifyContent: 'center',
		alignItems: 'center',
		width: 35,
		height: 35,
		borderRadius: 10,
	},
	activeIconContainer: {
		// For active icon's orange background
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FF6B00', // Orange background for active tab
		width: 40,
		height: 40,
		borderRadius: 10,
	},
});
