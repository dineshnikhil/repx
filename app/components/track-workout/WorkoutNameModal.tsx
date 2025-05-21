import React, { useEffect, useState } from 'react';
import {
	Keyboard,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

interface WorkoutNameModalProps {
	isVisible: boolean;
	currentName: string;
	onSave: (name: string) => void;
	onClose: () => void;
}

export const WorkoutNameModal: React.FC<WorkoutNameModalProps> = ({
	isVisible,
	currentName,
	onSave,
	onClose,
}) => {
	const [workoutName, setWorkoutName] = useState('');

	// Update the workout name when the modal becomes visible
	useEffect(() => {
		if (isVisible) {
			setWorkoutName(currentName);
		}
	}, [isVisible, currentName]);

	const handleSave = () => {
		onSave(workoutName.trim() || 'Track Workout');
		onClose();
	};

	return (
		<Modal
			visible={isVisible}
			animationType="fade"
			transparent={true}
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Edit Workout Name</Text>

						<TextInput
							style={styles.input}
							value={workoutName}
							onChangeText={setWorkoutName}
							placeholder="Enter workout name"
							placeholderTextColor="#666"
							autoFocus={true}
							autoCapitalize="words"
						/>

						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={[styles.button, styles.cancelButton]}
								onPress={onClose}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.button, styles.saveButton]}
								onPress={handleSave}
							>
								<Text style={styles.saveButtonText}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '85%',
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
	},
	modalTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		padding: 12,
		color: 'white',
		fontSize: 16,
		marginBottom: 20,
	},
	buttonContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
	},
	button: {
		borderRadius: 8,
		padding: 12,
		width: '48%',
		alignItems: 'center',
	},
	cancelButton: {
		backgroundColor: '#2C2C2E',
	},
	saveButton: {
		backgroundColor: '#FF5722',
	},
	cancelButtonText: {
		color: 'white',
		fontSize: 16,
	},
	saveButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
