import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function TrackWorkoutScreen() {
	const [timerRunning, setTimerRunning] = useState(true);
	const [duration, setDuration] = useState(0); // time in seconds
	const [volume, setVolume] = useState(0); // weight in kg
	const [sets, setSets] = useState(9);

	// Start the timer as soon as the screen loads
	useEffect(() => {
		let interval: number | undefined;

		if (timerRunning) {
			interval = setInterval(() => {
				setDuration((prevDuration) => prevDuration + 1);
			}, 1000) as unknown as number;
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timerRunning]);

	// Format the duration into hours, minutes, seconds
	const formatDuration = (totalSeconds: number): string => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		// Only show hours when there are hours to show
		if (hours > 0) {
			return `${hours}h ${minutes}mins ${seconds}s`;
		}
		// Only show minutes when there are minutes to show
		else if (minutes > 0) {
			return `${minutes}mins ${seconds}s`;
		}
		// Only show seconds at the beginning
		else {
			return `${seconds}s`;
		}
	};

	// Toggle timer function
	const toggleTimer = () => {
		setTimerRunning(!timerRunning);
	};

	// Go back to workouts screen
	const goBack = () => {
		router.push('/(tabs)/workouts');
	};

	// Discard workout
	const discardWorkout = () => {
		// Add confirmation dialog in a real app
		router.push('/(tabs)/workouts');
	};

	return (
		<LinearGradient colors={['#0057FF', '#0073E6']} style={styles.gradient}>
			<BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
			<SafeAreaView style={styles.safeArea}>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#000000"
					translucent={Platform.OS === 'android'}
				/>

				<View style={styles.container}>
					{/* Header */}
					<View style={styles.header}>
						<TouchableOpacity style={styles.backButton} onPress={goBack}>
							<Feather name="chevron-left" size={32} color="white" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Track Workout</Text>
						<TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
							<Ionicons
								name={timerRunning ? 'alarm' : 'alarm-outline'}
								size={28}
								color="#FF5722"
							/>
						</TouchableOpacity>
					</View>

					{/* Workout Stats */}
					<View style={styles.statsCard}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Duration</Text>
							<Text style={styles.statValueHighlighted}>
								{formatDuration(duration)}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Volume</Text>
							<Text style={styles.statValue}>{volume} kg</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Sets</Text>
							<Text style={styles.statValue}>{sets}</Text>
						</View>
					</View>

					{/* Workout Content Area */}
					<View style={styles.workoutContent}>
						<View style={styles.dumbellIconContainer}>
							<Feather name="hexagon" size={80} color="#333" />
							<Ionicons
								name="barbell-outline"
								size={40}
								color="#555"
								style={styles.dumbellIcon}
							/>
						</View>
						<Text style={styles.getStartedText}>Get Started</Text>
						<Text style={styles.instructionText}>
							Add an exercise to start your workout
						</Text>
					</View>

					{/* Add Exercise Button */}
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => router.push('/track-workout/search')}
					>
						<Text style={styles.addButtonText}>+ Add Exercise</Text>
					</TouchableOpacity>

					{/* Bottom Actions */}
					<View style={styles.bottomActions}>
						<TouchableOpacity style={styles.settingsButton}>
							<Text style={styles.settingsText}>Settings</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.discardButton}
							onPress={discardWorkout}
						>
							<Text style={styles.discardText}>Discard Workout</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	container: {
		flex: 1,
		padding: 20,
		paddingBottom: 100, // Add padding at the bottom to make room for the tab navigation
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	backButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 25,
	},
	headerTitle: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
	timerButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 25,
	},
	statsCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 40,
	},
	statItem: {
		alignItems: 'center',
	},
	statLabel: {
		color: '#999',
		fontSize: 16,
		marginBottom: 8,
	},
	statValue: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
	statValueHighlighted: {
		color: '#FF5722',
		fontSize: 24,
		fontWeight: 'bold',
	},
	workoutContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dumbellIconContainer: {
		position: 'relative',
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dumbellIcon: {
		position: 'absolute',
	},
	getStartedText: {
		color: 'white',
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	instructionText: {
		color: '#999',
		fontSize: 16,
		textAlign: 'center',
	},
	addButton: {
		backgroundColor: '#FF5722',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		marginBottom: 20,
	},
	addButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	bottomActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 30,
	},
	settingsButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		width: '48%',
		alignItems: 'center',
		padding: 16,
	},
	settingsText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	discardButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		width: '48%',
		alignItems: 'center',
		padding: 16,
	},
	discardText: {
		color: '#FF3B30',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
