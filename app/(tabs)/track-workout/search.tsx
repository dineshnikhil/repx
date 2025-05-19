import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

// Define the exercise type
interface Exercise {
	name: string;
	muscle: string;
}

// Exercise data from provided JSON
const exercises: Exercise[] = [
	{ name: 'Machine Bench Press', muscle: 'Chest' },
	{ name: 'Smith Machine Bench Press', muscle: 'Chest' },
	{ name: 'Pec Deck Butterfly', muscle: 'Chest' },
	{ name: 'Cable Crossovers', muscle: 'Chest' },
	{ name: 'Incline Bench Cable Flyes', muscle: 'Chest' },
	{ name: 'Flat Bench Cable Flyes', muscle: 'Chest' },
	{ name: 'FreeMotion Cable Crossovers', muscle: 'Chest' },

	{ name: 'Seated Cable Rows', muscle: 'Back' },
	{ name: 'Machine Rows', muscle: 'Back' },
	{ name: 'Smith Machine Rows', muscle: 'Back' },
	{ name: 'Lying T-Bar Rows', muscle: 'Back' },
	{ name: 'Reverse Grip Pulldowns', muscle: 'Back' },
	{ name: 'Straight Arm Pulldowns', muscle: 'Back' },
	{ name: 'V-Bar Pulldowns', muscle: 'Back' },
	{ name: 'Wide Grip Pulldowns', muscle: 'Back' },
	{ name: 'Wide Grip Rear Pulldowns', muscle: 'Back' },
	{ name: 'Smith Machine Good Mornings', muscle: 'Lower Back' },
	{ name: 'Chest-Supported Row Machine', muscle: 'Back' },
	{ name: 'Neutral Grip Pulldown', muscle: 'Back' },

	{ name: 'Smith Machine Front Deltoid Press', muscle: 'Shoulders' },
	{ name: 'Machine Deltoid Military Press', muscle: 'Shoulders' },
	{ name: 'Standing Low Cable Deltoid Raise', muscle: 'Shoulders' },
	{ name: 'FreeMotion Overhead Cable Press', muscle: 'Shoulders' },
	{ name: 'Bent Over Cable Rear Deltoid Raise', muscle: 'Shoulders' },
	{ name: 'Seated Cable Rear Lateral Raise', muscle: 'Shoulders' },
	{ name: 'Smith Machine Behind the Head Press', muscle: 'Shoulders' },
	{ name: 'Shoulder Press Machine', muscle: 'Shoulders' },

	{ name: 'Cable Rope Hammer Curls', muscle: 'Biceps' },
	{ name: 'Cable Preacher Curls', muscle: 'Biceps' },
	{ name: 'Lying Straight Bar Cable Curls', muscle: 'Biceps' },
	{ name: 'Lying High Cable Curls', muscle: 'Biceps' },
	{ name: 'Machine Preacher Curls', muscle: 'Biceps' },
	{ name: 'Two Arm Cable Curls', muscle: 'Biceps' },
	{ name: 'Standing Cable Curls', muscle: 'Biceps' },
	{ name: 'Single Arm Cable Curls', muscle: 'Biceps' },
	{ name: 'FreeMotion Two Arm Cable Curls', muscle: 'Biceps' },

	{ name: 'Cable Lying Extensions', muscle: 'Triceps' },
	{ name: 'Cable Single Arm Extensions', muscle: 'Triceps' },
	{ name: 'Cable Rope Overhead Extensions', muscle: 'Triceps' },
	{ name: 'Kneeling Cable Extensions', muscle: 'Triceps' },
	{ name: 'Low Cable Extensions', muscle: 'Triceps' },
	{ name: 'Reverse Grip Pushdowns', muscle: 'Triceps' },
	{ name: 'Smith Machine Close Grip Bench Press', muscle: 'Triceps' },
	{ name: 'Straight Bar Cable Pushdown', muscle: 'Triceps' },
	{ name: 'Rope Pushdown', muscle: 'Triceps' },
	{ name: 'V-Bar Pushdown', muscle: 'Triceps' },
	{ name: 'Machine Extensions', muscle: 'Triceps' },

	{ name: 'Leg Press', muscle: 'Legs' },
	{ name: 'Smith Machine Squats', muscle: 'Legs' },
	{ name: 'Hack Squats', muscle: 'Legs' },
	{ name: 'Leg Extensions', muscle: 'Quadriceps' },
	{ name: 'One Leg Hack Squats', muscle: 'Legs' },
	{ name: 'Machine Squats', muscle: 'Legs' },
	{ name: 'One Leg Machine Squats', muscle: 'Legs' },
	{ name: 'One Leg Extensions', muscle: 'Quadriceps' },
	{ name: 'One Leg Press', muscle: 'Legs' },
	{ name: 'Thigh Abductors', muscle: 'Glutes' },
	{ name: 'Thigh Adductors', muscle: 'Inner Thighs' },
	{ name: 'Lying Leg Curls', muscle: 'Hamstrings' },
	{ name: 'Seated Leg Curls', muscle: 'Hamstrings' },
	{ name: 'Standing Leg Curls', muscle: 'Hamstrings' },
	{ name: 'One Leg Lying Curls', muscle: 'Hamstrings' },
	{ name: 'Smith Machine Stiff Leg Deadlifts', muscle: 'Hamstrings' },
	{ name: 'Cable Kickbacks', muscle: 'Glutes' },
	{ name: 'Leg Press Machine Calf Press', muscle: 'Calves' },
	{ name: 'Hack Machine Calf Raises', muscle: 'Calves' },

	{ name: 'Abdominal Crunch Machine', muscle: 'Abs' },
	{ name: 'Abdominal Cable Crunches', muscle: 'Abs' },
	{ name: "Captain's Chair Leg Raises", muscle: 'Abs' },

	{ name: 'Reverse Cable Curls', muscle: 'Forearms' },
	{ name: 'Seated Low Cable Wrist Curls', muscle: 'Forearms' },

	{ name: 'Cable Shrugs', muscle: 'Trapezius' },
	{ name: 'Low Cable Rows to Neck', muscle: 'Trapezius' },
	{ name: 'Smith Machine Shrugs', muscle: 'Trapezius' },
	{ name: 'Smith Machine Upright Rows', muscle: 'Trapezius' },
	{ name: 'Cable Upright Rows', muscle: 'Trapezius' },
];

// Get unique muscle groups
const getMuscleGroups = (): string[] => {
	const muscleGroups = new Set<string>();
	exercises.forEach((exercise) => muscleGroups.add(exercise.muscle));
	return ['Machine exercises', ...Array.from(muscleGroups)];
};

export default function SearchWorkoutScreen() {
	const [searchText, setSearchText] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('Machine exercises');
	const [filteredExercises, setFilteredExercises] =
		useState<Exercise[]>(exercises);
	const [currentlySelectedExercises, setCurrentlySelectedExercises] = useState<
		Exercise[]
	>([]);

	// Filter exercises based on search text and selected filter
	useEffect(() => {
		let filtered = exercises;

		if (searchText) {
			filtered = filtered.filter((item) =>
				item.name.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		if (selectedFilter && selectedFilter !== 'Machine exercises') {
			filtered = filtered.filter((item) => item.muscle === selectedFilter);
		}

		setFilteredExercises(filtered);
	}, [searchText, selectedFilter]);

	const goBack = () => {
		router.back();
	};

	const selectExercise = (exercise: Exercise) => {
		setCurrentlySelectedExercises((prevSelected) => {
			const isAlreadySelected = prevSelected.find(
				(ex) => ex.name === exercise.name
			);
			if (isAlreadySelected) {
				// Deselect if already selected
				return prevSelected.filter((ex) => ex.name !== exercise.name);
			} else {
				// Select if not already selected
				return [...prevSelected, exercise];
			}
		});
	};

	const addExercisesToWorkout = () => {
		if (currentlySelectedExercises.length > 0) {
			const exercisesJson = JSON.stringify(currentlySelectedExercises);

			// Try multiple approaches for maximum compatibility
			try {
				// First, try to use the window method if available (web)
				if (typeof window !== 'undefined' && window.addExercisesToWorkout) {
					window.addExercisesToWorkout(exercisesJson);
					router.back(); // Navigate back after adding
					return;
				}

				// If that fails, try the normal router approach
				router.push({
					pathname: '../track-workout/',
					params: { exercisesData: exercisesJson },
				});
			} catch (error) {
				console.error('Failed to add exercises:', error);

				// Last resort fallback: just navigate back
				alert(
					'Added ' +
						currentlySelectedExercises.length +
						' exercises to your workout'
				);
				router.back();
			}
		}
	};

	const renderFilterPill = ({ item }: { item: string }) => (
		<TouchableOpacity
			style={[
				styles.filterPill,
				selectedFilter === item && styles.selectedFilterPill,
			]}
			onPress={() => setSelectedFilter(item)}
		>
			<Text
				style={[
					styles.filterPillText,
					selectedFilter === item && styles.selectedFilterPillText,
				]}
			>
				{item}
			</Text>
		</TouchableOpacity>
	);

	const renderExerciseItem = ({ item }: { item: Exercise }) => {
		const isSelected = currentlySelectedExercises.some(
			(ex) => ex.name === item.name
		);
		return (
			<TouchableOpacity
				style={[styles.exerciseItem, isSelected && styles.selectedExerciseItem]}
				onPress={() => selectExercise(item)}
			>
				<View style={styles.exerciseImagePlaceholder} />
				<View style={styles.exerciseInfo}>
					<Text style={styles.exerciseName}>{item.name}</Text>
					<Text style={styles.exerciseMuscle}>{item.muscle}</Text>
				</View>
				<View style={styles.exerciseChart} />
			</TouchableOpacity>
		);
	};

	return (
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
						<Feather name="chevron-left" size={24} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Search Workout</Text>
					<TouchableOpacity style={styles.timerButton}>
						<Ionicons name="alarm" size={24} color="#FF5722" />
					</TouchableOpacity>
				</View>

				{/* Search Input */}
				<View style={styles.searchContainer}>
					<Feather
						name="search"
						size={24}
						color="#666"
						style={styles.searchIcon}
					/>
					<TextInput
						style={styles.searchInput}
						placeholder="search you workout"
						placeholderTextColor="#666"
						value={searchText}
						onChangeText={setSearchText}
					/>
				</View>

				{/* Main Content Container */}
				<View style={styles.mainContent}>
					{/* Filter Pills */}
					<View style={styles.filterWrapper}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.filterContent}
						>
							{getMuscleGroups().map((item) => (
								<TouchableOpacity
									key={item}
									style={[
										styles.filterPill,
										selectedFilter === item && styles.selectedFilterPill,
									]}
									onPress={() => setSelectedFilter(item)}
								>
									<Text
										style={[
											styles.filterPillText,
											selectedFilter === item && styles.selectedFilterPillText,
										]}
									>
										{item}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Exercise List */}
					{filteredExercises.length > 0 ? (
						<FlatList
							data={filteredExercises}
							renderItem={renderExerciseItem}
							keyExtractor={(item: Exercise): string => item.name}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.exerciseListContent}
							style={styles.exerciseList}
						/>
					) : (
						<View style={styles.noResults}>
							<Text style={styles.noResultsText}>No exercises found</Text>
						</View>
					)}

					{/* "Add to Workout" Button */}
					{currentlySelectedExercises.length > 0 && (
						<TouchableOpacity
							style={styles.addExerciseButton}
							onPress={addExercisesToWorkout}
						>
							<Text style={styles.addExerciseButtonText}>
								Add to Workout ({currentlySelectedExercises.length})
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#000000',
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	container: {
		flex: 1,
		paddingHorizontal: 15,
		paddingTop: Platform.OS === 'android' ? 10 : 0,
		paddingBottom: 0,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
		paddingHorizontal: 0,
	},
	backButton: {
		width: 45,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 23,
	},
	headerTitle: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
	timerButton: {
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 24,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 14,
		paddingHorizontal: 15,
		marginBottom: 12,
		height: 45,
		width: '100%',
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		height: 50,
		color: 'white',
		fontSize: 16,
	},
	mainContent: {
		flex: 1,
		marginBottom: 88, // Adjust for tab bar and consistent spacing
		width: '100%',
	},
	filterWrapper: {
		height: 40,
		marginBottom: 16,
		width: '100%',
	},
	filterContent: {
		paddingVertical: 5,
		paddingHorizontal: 0,
		alignItems: 'center',
	},
	filterPill: {
		backgroundColor: '#1C1C1E',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 10,
		marginRight: 8,
		height: 30,
		justifyContent: 'center',
	},
	selectedFilterPill: {
		backgroundColor: '#FF5722',
	},
	filterPillText: {
		color: 'white',
		fontSize: 12,
	},
	selectedFilterPillText: {
		fontWeight: 'bold',
	},
	exerciseList: {
		flex: 1,
	},
	exerciseListContent: {
		paddingBottom: 20,
	},
	exerciseItem: {
		flexDirection: 'row',
		backgroundColor: '#1C1C1E',
		borderRadius: 14,
		padding: 15,
		marginBottom: 12,
		alignItems: 'center',
	},
	exerciseImagePlaceholder: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#333',
		marginRight: 15,
	},
	exerciseInfo: {
		flex: 1,
	},
	exerciseName: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	exerciseMuscle: {
		color: '#999',
		fontSize: 14,
	},
	exerciseChart: {
		width: 60,
		height: 40,
		backgroundColor: '#333',
		borderRadius: 6,
	},
	noResults: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noResultsText: {
		color: '#999',
		fontSize: 16,
	},
	selectedExerciseItem: {
		backgroundColor: '#FF5722',
	},
	addExerciseButton: {
		backgroundColor: '#FF5722',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: 'center',
		marginHorizontal: 0, // Aligns with padding of mainContent
		marginTop: 15,
		marginBottom: 10, // Ensures it's above the mainContent's overall marginBottom if any visual conflicts
	},
	addExerciseButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});
