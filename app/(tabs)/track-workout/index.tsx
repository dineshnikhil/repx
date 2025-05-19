import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	Modal,
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
	id: string;
	previous: string;
	kg: string;
	reps: string;
	completed: boolean;
}

interface WorkoutExercise {
	name: string;
	muscle: string;
	sets: ExerciseSet[];
	comment?: string;
}

// Base exercise type (could be imported from a shared types file)
interface BaseExercise {
	name: string;
	muscle: string;
}

// First, add this type declaration at the top of the file
declare global {
	interface Window {
		addExercisesToWorkout?: (exercisesDataJson: string) => void;
	}
}

export default function TrackWorkoutScreen() {
	// Use a ref to track if we've processed parameters to avoid reprocessing
	const hasProcessedParams = useRef(false);

	// Use regular state for workout exercises
	const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
		[]
	);

	const [timerRunning, setTimerRunning] = useState(true);
	const [duration, setDuration] = useState(0);

	// Modal States
	const [isCommentModalVisible, setCommentModalVisible] = useState(false);
	const [currentCommentText, setCurrentCommentText] = useState('');
	const [commentingExerciseName, setCommentingExerciseName] = useState<
		string | null
	>(null);

	const [isDiscardModalVisible, setDiscardModalVisible] = useState(false);

	// Process incoming exercises manually from any incoming navigation
	useEffect(() => {
		// Get search params from global object
		try {
			// Access the URL if available - this is a more direct approach
			if (typeof window !== 'undefined' && window.location?.search) {
				const urlParams = new URLSearchParams(window.location.search);
				const exercisesData = urlParams.get('exercisesData');

				processNewExercises(exercisesData);
			}
		} catch (err) {
			console.log('URL parameter access error:', err);
			// Silently continue - this just means we're probably on native
		}
	}, []);

	// Function to process new exercises data
	const processNewExercises = (exercisesData: string | null) => {
		if (exercisesData && !hasProcessedParams.current) {
			try {
				console.log('Processing new exercises data');
				const newExercisesRaw = JSON.parse(exercisesData) as BaseExercise[];

				// Map to WorkoutExercise objects with initial sets
				const newWorkoutExercises = newExercisesRaw.map((ex, index) => ({
					...ex,
					sets: [
						{
							id: `set-${Date.now()}-${index}-${Math.random()
								.toString(36)
								.substring(2, 7)}`,
							previous: '-',
							kg: '',
							reps: '',
							completed: false,
						},
					],
					comment: '',
				}));

				// Add new exercises, avoiding duplicates by name
				setWorkoutExercises((prevExercises) => {
					console.log('Current exercises:', prevExercises.length);
					console.log('New exercises to add:', newWorkoutExercises.length);

					const existingNames = new Set(prevExercises.map((e) => e.name));
					const trulyNew = newWorkoutExercises.filter(
						(ne) => !existingNames.has(ne.name)
					);

					console.log('Truly new exercises after filtering:', trulyNew.length);
					const updatedExercises = [...prevExercises, ...trulyNew];

					return updatedExercises;
				});

				// Mark that we've processed these params
				hasProcessedParams.current = true;

				// Clear the URL params after a short delay
				setTimeout(() => {
					try {
						// Navigate to the same screen without params
						// router.replace('../track-workout/');
					} catch (e) {
						console.log('Failed to clear params:', e);
					}
				}, 300);
			} catch (error) {
				console.error('Failed to parse exercisesData:', error);
				hasProcessedParams.current = true; // Mark as processed even on error
			}
		}
	};

	// Public method that can be called when returning from search screen
	// We'll expose this through window for web compatibility
	if (typeof window !== 'undefined') {
		window.addExercisesToWorkout = (exercisesDataJson: string) => {
			hasProcessedParams.current = false; // Reset flag
			processNewExercises(exercisesDataJson);
		};
	}

	// Add function to manually reset the flag when navigating away
	const resetParamsFlag = () => {
		hasProcessedParams.current = false;
	};

	// Add this to navigation functions that lead to the search screen
	const goToSearchScreen = () => {
		resetParamsFlag(); // Reset flag before navigation
		router.push('/track-workout/search');
	};

	// Calculate total volume and sets from workoutExercises
	const totalVolume = workoutExercises.reduce((acc, exercise) => {
		return (
			acc +
			exercise.sets.reduce((setAcc, currentSet) => {
				const weight = parseFloat(currentSet.kg) || 0;
				const numReps = parseInt(currentSet.reps, 10) || 0;
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
		// router.push('/(tabs)/workouts'); // We'll replace this with modal
		setDiscardModalVisible(true);
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

	// Comment Modal Functions
	const openCommentModal = (exerciseName: string) => {
		const exercise = workoutExercises.find((ex) => ex.name === exerciseName);
		setCurrentCommentText(exercise?.comment || '');
		setCommentingExerciseName(exerciseName);
		setCommentModalVisible(true);
	};

	const handleSaveComment = () => {
		if (commentingExerciseName) {
			setWorkoutExercises((prevExercises) =>
				prevExercises.map((ex) =>
					ex.name === commentingExerciseName
						? { ...ex, comment: currentCommentText }
						: ex
				)
			);
		}
		setCommentModalVisible(false);
		setCurrentCommentText('');
		setCommentingExerciseName(null);
	};

	const handleCloseCommentModal = () => {
		setCommentModalVisible(false);
		setCurrentCommentText('');
		setCommentingExerciseName(null);
	};

	// Discard Modal Functions
	const handleConfirmDiscard = () => {
		setWorkoutExercises([]); // Clear exercises
		setDuration(0); // Reset duration
		// Optionally reset other relevant states
		router.push('/(tabs)/workouts');
		setDiscardModalVisible(false);
	};

	const handleCloseDiscardModal = () => {
		setDiscardModalVisible(false);
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
							{exercise.comment || 'Add a comment...'}
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
					<View
						key={set.id}
						style={[styles.setRow, set.completed && styles.setRowCompleted]}
					>
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
					<TouchableOpacity
						style={styles.addCommentButton}
						onPress={() => openCommentModal(exercise.name)}
					>
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
		<LinearGradient colors={['#101010', '#000000']} style={styles.gradient}>
			<SafeAreaView style={styles.safeArea}>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#000000" // Or match gradient, though usually for modals/full screen
					translucent={Platform.OS === 'android'}
				/>
				{/* Non-scrollable top section */}
				<View style={styles.topSectionContainer}>
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
				</View>

				{/* Main Content Area: Scrollable or Centered based on exercises */}
				<View style={styles.mainContentFlexContainer}>
					{workoutExercises.length === 0 ? (
						<View style={styles.getStartedOuterContainer}>
							<View style={styles.workoutContent}>
								{/* For centering the message */}
								<View style={styles.dumbellIconContainer}>
									<Feather name="hexagon" size={80} color="#666" />
									<Ionicons
										name="barbell-outline"
										size={40}
										color="#888"
										style={styles.dumbellIcon}
									/>
								</View>
								<Text style={styles.getStartedText}>Get Started</Text>
								<Text style={styles.instructionText}>
									Add an exercise to start your workout
								</Text>
							</View>
							{/* Buttons for Get Started View */}
							<View style={styles.actionButtonsContainer}>
								<TouchableOpacity
									style={styles.addButton}
									onPress={goToSearchScreen}
								>
									<Text style={styles.addButtonText}>+ Add Exercise</Text>
								</TouchableOpacity>
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
						</View>
					) : (
						<FlatList
							data={workoutExercises}
							renderItem={renderExerciseCard}
							keyExtractor={(item) => item.name}
							style={styles.exerciseList}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.exerciseListContentContainer}
							ListFooterComponentStyle={styles.listFooterComponentStyle}
							ListFooterComponent={
								<>
									<TouchableOpacity
										style={styles.addButton}
										onPress={goToSearchScreen}
									>
										<Text style={styles.addButtonText}>+ Add Exercise</Text>
									</TouchableOpacity>
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
									{/* Spacing for tab bar */}
									<View style={{ height: 40 }} />
								</>
							}
						/>
					)}
				</View>

				{/* Comment Modal */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={isCommentModalVisible}
					onRequestClose={handleCloseCommentModal}
				>
					<View style={styles.modalBackdrop}>
						<View style={styles.modalContainer}>
							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={handleCloseCommentModal}
							>
								<Ionicons name="close-circle" size={28} color="#777" />
							</TouchableOpacity>
							<Text style={styles.modalTitle}>
								Add your comment for exercise
							</Text>
							<TextInput
								style={styles.modalTextInput}
								placeholder="Enter your comment..."
								placeholderTextColor="#888"
								value={currentCommentText}
								onChangeText={setCurrentCommentText}
								multiline={true}
								numberOfLines={4}
							/>
							<TouchableOpacity
								style={styles.modalButtonOrange}
								onPress={handleSaveComment}
							>
								<Text style={styles.modalButtonText}>Add Comment</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* Discard Workout Confirmation Modal */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={isDiscardModalVisible}
					onRequestClose={handleCloseDiscardModal}
				>
					<View style={styles.modalBackdrop}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>Discard Workout?</Text>
							<Text style={styles.modalMessage}>
								Are you sure you want to discard the workout in progress?
							</Text>
							<TouchableOpacity
								style={styles.modalButtonDestructive}
								onPress={handleConfirmDiscard}
							>
								<Text style={styles.modalButtonText}>Discard Workout</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.modalButtonSecondary}
								onPress={handleCloseDiscardModal}
							>
								<Text style={styles.modalButtonSecondaryText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
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
		// Removed specific paddingTop for Android StatusBar, handled by SafeAreaView/Platform conditionally if needed
	},
	topSectionContainer: {
		// Holds Header and StatsCard
		paddingHorizontal: 24,
		paddingTop:
			Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 24, // Adjust top padding
		// marginBottom: 0, // statsCard already has marginBottom
	},
	mainContentFlexContainer: {
		// This container will take the remaining space
		flex: 1,
		paddingHorizontal: 24, // Horizontal padding for the content area
	},
	getStartedOuterContainer: {
		// For "Get Started" view including its buttons
		flex: 1,
		justifyContent: 'space-between', // Pushes message to top, buttons to bottom
		paddingBottom: 20, // Space above tab bar or screen bottom
	},
	actionButtonsContainer: {
		// Wraps buttons in Get Started view
		// styles.addButton and styles.bottomActions already have their own margins
		// This container is for layout if needed, or can be removed if direct styling is enough
		paddingBottom: 20, // ensure spacing from absolute bottom edge
	},
	listFooterComponentStyle: {
		// paddingHorizontal: 24, // If FlatList itself doesn't have it
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
	exerciseList: {
		// Style for the FlatList itself if needed
		// flex: 1, // This will be handled by mainContentFlexContainer for FlatList's parent
	},
	exerciseListContentContainer: {
		// For content within FlatList (padding for items)
		paddingTop: 10, // Space between StatsCard and first exercise card
		// paddingBottom handled by ListFooterComponent's View for tab bar spacing
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
		borderRadius: 6, // Add a slight border radius to the row itself for the background color
	},
	setRowCompleted: {
		backgroundColor: 'rgba(46, 139, 87, 0.25)', // Darker, less transparent green
	},
	setDataCell: {
		color: 'white',
		fontSize: 14,
		textAlign: 'center',
		fontWeight: 'bold',
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
	// Modal Styles
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		backgroundColor: '#1C1C1E', // Dark background for modal
		borderRadius: 16,
		padding: 20,
		width: '90%', // Increased width
		alignItems: 'center', // Center content like title and buttons
	},
	modalCloseButton: {
		position: 'absolute',
		top: 10,
		left: 10,
		padding: 5,
		zIndex: 1, // Ensure the close button is on top
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 15,
		textAlign: 'center',
		paddingHorizontal: 35, // Add horizontal padding to avoid overlap with close button
	},
	modalMessage: {
		fontSize: 16,
		color: '#DDD', // Light gray for message text
		textAlign: 'center',
		marginBottom: 20,
		lineHeight: 22,
	},
	modalTextInput: {
		backgroundColor: '#2C2C2E', // Slightly lighter dark for input
		color: 'white',
		borderRadius: 12, // Increased border radius
		padding: 12,
		width: '100%',
		minHeight: 100, // For multiline
		textAlignVertical: 'top', // For multiline Android
		fontSize: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#444',
	},
	modalButtonOrange: {
		backgroundColor: '#FF5722', // Orange button
		borderRadius: 16, // Increased border radius
		paddingVertical: 14, // Adjusted padding
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	modalButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	modalButtonDestructive: {
		backgroundColor: '#D32F2F', // Red for destructive
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	modalButtonSecondary: {
		backgroundColor: '#3A3A3C', // Dark gray for secondary/cancel
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
	},
	modalButtonSecondaryText: {
		color: '#FFFFFF', // White text for secondary button
		fontSize: 16,
		fontWeight: 'bold',
	},
});
