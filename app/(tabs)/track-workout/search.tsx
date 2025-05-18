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
		// Here we'd typically add the exercise to the workout
		// For now, just navigate back
		router.back();
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

	const renderExerciseItem = ({ item }: { item: Exercise }) => (
		<TouchableOpacity
			style={styles.exerciseItem}
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

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar
				barStyle="light-content"
				backgroundColor="#000000"
				translucent={Platform.OS === 'android'}
			/>

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={goBack}>
					<Feather name="chevron-left" size={32} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Search Workout</Text>
				<TouchableOpacity style={styles.timerButton}>
					<Ionicons name="alarm" size={28} color="#FF5722" />
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
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop:
			Platform.OS === 'android'
				? StatusBar.currentHeight
					? StatusBar.currentHeight + 20
					: 40
				: 20,
		paddingBottom: 0,
		backgroundColor: '#000000',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
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
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		paddingHorizontal: 15,
		marginBottom: 10,
		height: 50,
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
		marginBottom: 80, // Adjust for tab bar
	},
	filterWrapper: {
		height: 40,
		marginBottom: 10,
	},
	filterContent: {
		paddingVertical: 5,
		alignItems: 'center',
	},
	filterPill: {
		backgroundColor: '#1C1C1E',
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 16,
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
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
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
});
