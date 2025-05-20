import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { ExerciseSet, WorkoutExercise } from '../../types/workout';

interface ExerciseCardProps {
	exercise: WorkoutExercise;
	handleSetChange: (
		exerciseName: string,
		setId: string,
		field: keyof ExerciseSet,
		value: string | boolean
	) => void;
	addSetToExercise: (exerciseName: string) => void;
	removeSetFromExercise: (exerciseName: string, setId: string) => void;
	openCommentModal: (exerciseName: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
	exercise,
	handleSetChange,
	addSetToExercise,
	removeSetFromExercise,
	openCommentModal,
}) => {
	const [unit, setUnit] = useState<'Kg' | 'Lbs'>('Kg');

	// Function to toggle the unit
	const toggleUnit = () => {
		setUnit((prevUnit) => (prevUnit === 'Kg' ? 'Lbs' : 'Kg'));
	};

	// Determine if a set is completed based on having both kg and reps
	const isSetCompleted = (set: ExerciseSet): boolean => {
		return !!(
			set.kg &&
			set.kg.trim() !== '' &&
			set.reps &&
			set.reps.trim() !== ''
		);
	};

	// Effect to update completed status after render
	useEffect(() => {
		exercise.sets.forEach((set) => {
			const calculatedCompleted = isSetCompleted(set);
			if (calculatedCompleted !== set.completed) {
				handleSetChange(
					exercise.name,
					set.id,
					'completed',
					calculatedCompleted
				);
			}
		});
	}, [exercise.sets, exercise.name, handleSetChange]); // Dependencies for the effect

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

			<View style={styles.tableContainer}>
				{/* Table header row */}
				<View style={styles.headerRow}>
					<View style={styles.cellSet}>
						<Text style={styles.headerText}>Set</Text>
					</View>
					<View style={styles.cellPrevious}>
						<Text style={styles.headerText}>Previous</Text>
					</View>
					<View style={styles.cellKg}>
						<TouchableOpacity onPress={toggleUnit}>
							<Text style={styles.headerText}>{unit}</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.cellReps}>
						<Text style={styles.headerText}>Reps</Text>
					</View>
					<View style={styles.cellAction}></View>
				</View>

				{/* Table divider line */}
				<View style={styles.divider} />

				{/* Table data rows */}
				{exercise.sets.map((set, index) => {
					// set.completed will be updated by the useEffect, so we can use it directly for styling here
					// The direct call to handleSetChange is removed from here
					const setCompleted = set.completed;

					return (
						<View
							key={set.id}
							style={[styles.dataRow, setCompleted && styles.completedRow]}
						>
							<View style={styles.cellSet}>
								<Text style={styles.cellText}>{index + 1}</Text>
							</View>
							<View style={styles.cellPrevious}>
								<Text style={styles.cellText}>{set.previous}</Text>
							</View>
							<View style={styles.cellKg}>
								<TextInput
									style={styles.cellInput}
									value={set.kg}
									onChangeText={(text) =>
										handleSetChange(exercise.name, set.id, 'kg', text)
									}
									keyboardType="numeric"
									placeholder="-"
									placeholderTextColor="#555"
									textAlign="center"
								/>
							</View>
							<View style={styles.cellReps}>
								<TextInput
									style={styles.cellInput}
									value={set.reps}
									onChangeText={(text) =>
										handleSetChange(exercise.name, set.id, 'reps', text)
									}
									keyboardType="numeric"
									placeholder="-"
									placeholderTextColor="#555"
									textAlign="center"
								/>
							</View>
							{exercise.sets.length > 1 && (
								<View style={styles.cellAction}>
									<TouchableOpacity
										onPress={() => removeSetFromExercise(exercise.name, set.id)}
									>
										<Ionicons
											name="remove-circle-outline"
											size={20}
											color="#FF5722"
										/>
									</TouchableOpacity>
								</View>
							)}
						</View>
					);
				})}
			</View>

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

const styles = StyleSheet.create({
	exerciseCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 14,
		padding: 15,
		marginBottom: 15,
	},
	exerciseCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 19,
	},
	exerciseIconPlaceholder: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#333',
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
		color: '#8A8A8E',
		fontSize: 13,
	},
	exerciseOptionsButton: {
		padding: 5,
	},
	tableContainer: {
		marginBottom: 15,
	},
	headerRow: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	dataRow: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 6,
		marginBottom: 8,
	},
	completedRow: {
		backgroundColor: 'rgba(46, 139, 87, 0.25)',
	},
	divider: {
		height: 1,
		backgroundColor: '#3A3A3C',
		marginTop: 5,
		marginBottom: 8,
	},
	cellSet: {
		width: '12%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cellPrevious: {
		width: '28%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cellKg: {
		width: '25%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cellReps: {
		width: '25%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cellAction: {
		width: '10%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerText: {
		color: '#8A8A8E',
		fontSize: 12,
		fontWeight: '600',
	},
	cellText: {
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	cellInput: {
		color: 'white',
		fontSize: 14,
		width: '100%',
		textAlign: 'center',
		paddingVertical: 0,
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
		backgroundColor: '#2C2C2E',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
	addCommentButtonText: {
		color: '#FF5722',
		fontSize: 13,
		fontWeight: 'bold',
	},
});
