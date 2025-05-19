import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { CommentModal } from '../../components/track-workout/CommentModal';
import { DiscardModal } from '../../components/track-workout/DiscardModal';
import { ExerciseCard } from '../../components/track-workout/ExerciseCard';
import { GetStarted } from '../../components/track-workout/GetStarted';
import { Header } from '../../components/track-workout/Header';
import { StatsCard } from '../../components/track-workout/StatsCard';
import { useWorkoutStatus } from '../../contexts/WorkoutStatusContext';
import {
	BaseExercise,
	ExerciseSet,
	WorkoutExercise,
} from '../../types/workout';

// First, add this type declaration at the top of the file
declare global {
	interface Window {
		addExercisesToWorkout?: (exercisesDataJson: string) => void;
	}
}

export default function TrackWorkoutScreen() {
	// Use a ref to track if we've processed parameters to avoid reprocessing
	const hasProcessedParams = useRef(false);
	const params = useLocalSearchParams();

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

	const {
		isWorkoutInProgress,
		workoutNameToResume,
		setIsWorkoutInProgress,
		setWorkoutNameToResume,
	} = useWorkoutStatus();

	// Process incoming exercises manually from any incoming navigation
	useEffect(() => {
		// Get search params from global object
		try {
			// Access the URL if available - this is a more direct approach
			if (typeof window !== 'undefined' && window.location?.search) {
				const urlParams = new URLSearchParams(window.location.search);
				const exercisesData = urlParams.get('exercisesData');

				processNewExercises(exercisesData);

				// Check for discard action from layout
				const action = urlParams.get('action');
				if (action === 'discardFromLayout') {
					setDiscardModalVisible(true);
					// Clear the action param to prevent re-triggering
					router.replace('/(tabs)/track-workout');
				}
			}
		} catch (err) {
			console.log('URL parameter access error:', err);
			// Silently continue - this just means we're probably on native
		}
	}, []);

	// Effect to handle action parameter specifically for native if window.location.search is not available
	useEffect(() => {
		if (params.action === 'discardFromLayout') {
			setDiscardModalVisible(true);
			// Clear the action param to prevent re-triggering
			// For Expo Router, replacing with an empty object or specific params to clear
			router.setParams({ action: undefined }); // Or router.replace if full navigation is preferred
		}
	}, [params.action]);

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

	// Discard workout
	const discardWorkout = () => {
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
		setIsWorkoutInProgress(false); // Update context
		setWorkoutNameToResume(null); // Clear workout name
		router.push('/(tabs)/workouts');
		setDiscardModalVisible(false);
	};

	const handleCloseDiscardModal = () => {
		setDiscardModalVisible(false);
	};

	// Effect to update the workout status in context
	useEffect(() => {
		// Update workout status whenever workoutExercises changes
		const inProgress = workoutExercises.length > 0;
		setIsWorkoutInProgress(inProgress);

		// Set a workout name if there are exercises
		if (inProgress) {
			setWorkoutNameToResume('Active Workout');
		} else {
			setWorkoutNameToResume(null);
		}
	}, [workoutExercises.length, setIsWorkoutInProgress, setWorkoutNameToResume]);

	// Footer component for the exercise list
	const ExerciseListFooter = () => (
		<>
			<TouchableOpacity style={styles.addButton} onPress={goToSearchScreen}>
				<Text style={styles.addButtonText}>+ Add Exercise</Text>
			</TouchableOpacity>
			<View style={styles.bottomActions}>
				<TouchableOpacity style={styles.settingsButton}>
					<Text style={styles.settingsText}>Settings</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.discardButton} onPress={discardWorkout}>
					<Text style={styles.discardText}>Discard Workout</Text>
				</TouchableOpacity>
			</View>
			{/* Spacing for tab bar */}
			<View style={{ height: 40 }} />
		</>
	);

	return (
		<LinearGradient colors={['#101010', '#000000']} style={styles.gradient}>
			<SafeAreaView style={styles.safeArea}>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#000000"
					translucent={Platform.OS === 'android'}
				/>
				{/* Non-scrollable top section */}
				<View style={styles.topSectionContainer}>
					{/* Header */}
					<Header toggleTimer={toggleTimer} timerRunning={timerRunning} />

					{/* Workout Stats */}
					<StatsCard
						duration={duration}
						totalVolume={totalVolume}
						totalSets={totalSets}
						formatDuration={formatDuration}
					/>
				</View>

				{/* Main Content Area: Scrollable or Centered based on exercises */}
				<View style={styles.mainContentFlexContainer}>
					{workoutExercises.length === 0 ? (
						<GetStarted
							goToSearchScreen={goToSearchScreen}
							discardWorkout={discardWorkout}
						/>
					) : (
						<FlatList
							data={workoutExercises}
							renderItem={({ item }) => (
								<ExerciseCard
									exercise={item}
									handleSetChange={handleSetChange}
									addSetToExercise={addSetToExercise}
									removeSetFromExercise={removeSetFromExercise}
									openCommentModal={openCommentModal}
								/>
							)}
							keyExtractor={(item) => item.name}
							style={styles.exerciseList}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.exerciseListContentContainer}
							ListFooterComponentStyle={styles.listFooterComponentStyle}
							ListFooterComponent={<ExerciseListFooter />}
						/>
					)}
				</View>

				{/* Comment Modal */}
				<CommentModal
					isVisible={isCommentModalVisible}
					commentText={currentCommentText}
					onChangeText={setCurrentCommentText}
					onSave={handleSaveComment}
					onClose={handleCloseCommentModal}
				/>

				{/* Discard Workout Confirmation Modal */}
				<DiscardModal
					isVisible={isDiscardModalVisible}
					onConfirm={handleConfirmDiscard}
					onCancel={handleCloseDiscardModal}
				/>
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
	},
	mainContentFlexContainer: {
		// This container will take the remaining space
		flex: 1,
		paddingHorizontal: 24, // Horizontal padding for the content area
	},
	listFooterComponentStyle: {
		// If needed for footer positioning
	},
	exerciseList: {
		// Style for the FlatList itself if needed
	},
	exerciseListContentContainer: {
		// For content within FlatList (padding for items)
		paddingTop: 10, // Space between StatsCard and first exercise card
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
});
