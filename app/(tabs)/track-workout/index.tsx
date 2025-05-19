import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

// Define types for the workout structure
interface ExerciseSet {
	id: string; // Unique ID for the set
	previous: string;
	kg: string;
	reps: string;
	completed: boolean;
}

interface WorkoutExercise {
	name: string;
	muscle: string;
	sets: ExerciseSet[];
	comment?: string; // Optional comment for the exercise
}

// Base exercise type (could be imported from a shared types file)
interface BaseExercise {
	name: string;
	muscle: string;
}

export default function TrackWorkoutScreen() {
	const params = useLocalSearchParams<{ exercisesData?: string }>();
	const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
		[]
	);

	const [timerRunning, setTimerRunning] = useState(true);
	const [duration, setDuration] = useState(0); // time in seconds
	// Volume and Sets will be derived from workoutExercises
	// const [volume, setVolume] = useState(0);
	// const [sets, setSets] = useState(9);

	useEffect(() => {
		if (params.exercisesData) {
			try {
				const newExercisesRaw = JSON.parse(
					params.exercisesData
				) as BaseExercise[];
				const newWorkoutExercises = newExercisesRaw.map((ex, index) => ({
					...ex,
					// Add a default first set when an exercise is added
					sets: [
						{
							id: `set-${Date.now()}-${index}-0`,
							previous: '-',
							kg: '',
							reps: '',
							completed: false,
						},
					],
					comment: '', // Initialize with an empty comment
				}));

				// Add new exercises, avoiding duplicates by name if re-navigating
				setWorkoutExercises((prevExercises) => {
					const existingNames = new Set(prevExercises.map((e) => e.name));
					const trulyNew = newWorkoutExercises.filter(
						(ne) => !existingNames.has(ne.name)
					);
					return [...prevExercises, ...trulyNew];
				});

				// Clear the param to prevent re-adding on remounts/re-renders if not desired
				// Note: router.setParams might not be available or work as expected in all Expo Router versions for this.
				// Consider alternative state management for "processed params" if issues arise.
				if (router.canGoBack()) {
					// Check if we can go back before trying to modify params
					// This is a common pattern but might need adjustment based on your navigation flow
					// router.setParams({ exercisesData: undefined });
				}
			} catch (error) {
				console.error('Failed to parse exercisesData:', error);
			}
		}
	}, [params.exercisesData]);

	// Calculate total volume and sets from workoutExercises
	const totalVolume = workoutExercises.reduce((acc, exercise) => {
		return (
			acc +
			exercise.sets.reduce((setAcc, currentSet) => {
				const weight = parseFloat(currentSet.kg) || 0;
				const numReps = parseInt(currentSet.reps, 10) || 0;
				// Assuming each rep contributes to volume; adjust if only completed sets count
				return setAcc + weight * numReps;
			}, 0)
		);
	}, 0);

	const totalSets = workoutExercises.reduce((acc, exercise) => {
		return acc + exercise.sets.length;
	}, 0);

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

	// Handlers for individual exercise sets
	const handleSetChange = (
		exerciseName: string,
		setId: string,
		field: keyof ExerciseSet,
		value: string | boolean
	) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((ex) =>
				ex.name === exerciseName
					? {
							...ex,
							sets: ex.sets.map((set) =>
								set.id === setId ? { ...set, [field]: value } : set
							),
					  }
					: ex
			)
		);
	};

	const addSetToExercise = (exerciseName: string) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((ex) =>
				ex.name === exerciseName
					? {
							...ex,
							sets: [
								...ex.sets,
								{
									id: `set-${Date.now()}-${ex.name}-${ex.sets.length}`, // More unique ID
									previous: `${
										ex.sets.length > 0
											? ex.sets[ex.sets.length - 1].kg +
											  'kg x ' +
											  ex.sets[ex.sets.length - 1].reps
											: '-'
									}`, // Carry over previous set's data
									kg: ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].kg : '',
									reps:
										ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : '',
									completed: false,
								},
							],
					  }
					: ex
			)
		);
	};

	const removeSetFromExercise = (exerciseName: string, setId: string) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((ex) =>
				ex.name === exerciseName
					? {
							...ex,
							sets: ex.sets.filter((set) => set.id !== setId),
					  }
					: ex
			)
		);
	};

	const renderExerciseCard = ({
		item: exercise,
	}: {
		item: WorkoutExercise;
	}) => {
		return (
			<View style={styles.exerciseCard}>
				<View style={styles.exerciseCardHeader}>
					<View style={styles.exerciseIconPlaceholder} />
					<View style={styles.exerciseTitleContainer}>
						<Text style={styles.exerciseName}>{exercise.name}</Text>
						<Text style={styles.exerciseComment}>
							{exercise.comment || 'our comment will come here'}
						</Text>
					</View>
					<TouchableOpacity style={styles.exerciseOptionsButton}>
						<Ionicons name="ellipsis-vertical" size={24} color="white" />
					</TouchableOpacity>
				</View>

				<View style={styles.setsTableHeader}>
					<Text style={[styles.setsHeaderCell, styles.setNumCell]}>Set</Text>
					<Text style={[styles.setsHeaderCell, styles.previousCell]}>
						Previous
					</Text>
					<Text style={[styles.setsHeaderCell, styles.kgCell]}>Kg</Text>
					<Text style={[styles.setsHeaderCell, styles.repsCell]}>Reps</Text>
					<View style={[styles.checkboxCell]} />
				</View>

				{exercise.sets.map((set, index) => (
					<View key={set.id} style={styles.setRow}>
						<Text style={[styles.setDataCell, styles.setNumCell]}>
							{index + 1}
						</Text>
						<Text style={[styles.setDataCell, styles.previousCell]}>
							{set.previous}
						</Text>
						<TextInput
							style={[styles.setDataInput, styles.kgCell]}
							value={set.kg}
							onChangeText={(text) =>
								handleSetChange(exercise.name, set.id, 'kg', text)
							}
							keyboardType="numeric"
							placeholder="-"
							placeholderTextColor="#555"
						/>
						<TextInput
							style={[styles.setDataInput, styles.repsCell]}
							value={set.reps}
							onChangeText={(text) =>
								handleSetChange(exercise.name, set.id, 'reps', text)
							}
							keyboardType="numeric"
							placeholder="-"
							placeholderTextColor="#555"
						/>
						<TouchableOpacity
							style={[styles.checkboxContainer, styles.checkboxCell]}
							onPress={() =>
								handleSetChange(
									exercise.name,
									set.id,
									'completed',
									!set.completed
								)
							}
						>
							<View
								style={[
									styles.checkbox,
									set.completed && styles.checkboxCompleted,
								]}
							>
								{set.completed && (
									<Feather name="check" size={16} color="white" />
								)}
							</View>
						</TouchableOpacity>
						{exercise.sets.length > 1 && ( // Show remove button only if more than one set
							<TouchableOpacity
								onPress={() => removeSetFromExercise(exercise.name, set.id)}
								style={styles.removeSetButton}
							>
								<Ionicons
									name="remove-circle-outline"
									size={20}
									color="#FF5722"
								/>
							</TouchableOpacity>
						)}
					</View>
				))}

				<View style={styles.exerciseCardFooter}>
					<TouchableOpacity
						style={styles.addSetButton}
						onPress={() => addSetToExercise(exercise.name)}
					>
						<Text style={styles.addSetButtonText}>+ Add Set</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.addCommentButton}>
						<Ionicons
							name="chatbubble-outline"
							size={20}
							color="#FF5722"
							style={{ marginRight: 5 }}
						/>
						<Text style={styles.addCommentButtonText}>Add comment</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
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
							<Text style={styles.statValue}>{totalVolume} kg</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Sets</Text>
							<Text style={styles.statValue}>{totalSets}</Text>
						</View>
					</View>

					{/* Workout Content Area */}
					{workoutExercises.length === 0 ? (
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
					) : (
						<FlatList
							data={workoutExercises}
							renderItem={renderExerciseCard}
							keyExtractor={(item) => item.name}
							style={styles.exerciseListContainer}
							showsVerticalScrollIndicator={false}
							ListFooterComponent={<View style={{ height: 20 }} />} // Add some padding at the bottom
						/>
					)}

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
		padding: 24,
		paddingBottom: 100,
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
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 32,
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
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		marginBottom: 24,
	},
	addButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	bottomActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	settingsButton: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
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
		borderRadius: 16,
		width: '48%',
		alignItems: 'center',
		padding: 16,
	},
	discardText: {
		color: '#FF3B30',
		fontSize: 16,
		fontWeight: 'bold',
	},
	exerciseListContainer: {
		flex: 1,
		marginTop: 10, // Add some margin to separate from stats card
	},
	exerciseCard: {
		backgroundColor: '#1C1C1E', // Dark card background
		borderRadius: 14,
		padding: 15,
		marginBottom: 15,
	},
	exerciseCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	exerciseIconPlaceholder: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#333', // Placeholder color for exercise icon
		marginRight: 12,
	},
	exerciseTitleContainer: {
		flex: 1,
	},
	exerciseName: {
		color: 'white',
		fontSize: 17,
		fontWeight: 'bold',
	},
	exerciseComment: {
		color: '#8A8A8E', // Lighter gray for comment
		fontSize: 13,
	},
	exerciseOptionsButton: {
		padding: 5,
	},
	setsTableHeader: {
		flexDirection: 'row',
		borderBottomColor: '#3A3A3C',
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginBottom: 8,
	},
	setsHeaderCell: {
		color: '#8A8A8E',
		fontSize: 12,
		fontWeight: '600',
	},
	setRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		paddingVertical: 5,
	},
	setDataCell: {
		color: 'white',
		fontSize: 14,
		textAlign: 'center',
	},
	setDataInput: {
		color: 'white',
		fontSize: 14,
		textAlign: 'center',
		paddingVertical: 5, // Added padding for better touch
		// backgroundColor: '#2C2C2E', // Slightly different background for input
		// borderRadius: 5,
	},
	setNumCell: { flex: 0.15, textAlign: 'left' },
	previousCell: { flex: 0.25 },
	kgCell: { flex: 0.2 },
	repsCell: { flex: 0.2 },
	checkboxCell: { flex: 0.15, alignItems: 'flex-end' },
	checkboxContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 5, // Align checkbox better
	},
	checkbox: {
		width: 22,
		height: 22,
		borderRadius: 5,
		borderWidth: 1.5,
		borderColor: '#555',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxCompleted: {
		backgroundColor: '#FF5722', // Orange for completed
		borderColor: '#FF5722',
	},
	removeSetButton: {
		paddingLeft: 8, // Space from checkbox
		justifyContent: 'center',
		alignItems: 'center',
	},
	exerciseCardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		paddingTop: 10,
		borderTopColor: '#3A3A3C',
		borderTopWidth: 1,
	},
	addSetButton: {
		backgroundColor: '#FF5722',
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 8,
	},
	addSetButtonText: {
		color: 'white',
		fontSize: 13,
		fontWeight: 'bold',
	},
	addCommentButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E', // Darker button for secondary action
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
	addCommentButtonText: {
		color: '#FF5722', // Orange text
		fontSize: 13,
		fontWeight: 'bold',
	},
});
