import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false, // Hide labels
				tabBarActiveTintColor: '#0057ff', // Active tab white
				tabBarInactiveTintColor: '#8E8E93', // Inactive tab gray
				tabBarStyle: {
					backgroundColor: '#ffffff', // Black background for tab bar
					borderTopWidth: 0, // Remove top border line
					height: 60, // Adjust height as needed
					paddingBottom: 5,
					marginBottom: 8,
					marginHorizontal: 10, // Add padding for visual spacing if needed
					borderRadius: 20,
					overflow: 'hidden',
					position: 'absolute',
					bottom: 20,
					left: 20,
					right: 20,
					alignItems: 'center',
					justifyContent: 'center',
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
