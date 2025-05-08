import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface BodyWeightModalProps {
	visible: boolean;
	onClose: () => void;
	onTrack: (
		weight: string,
		unit: string,
		date: Date,
		onEmptyStomach: boolean
	) => void;
}

const BodyWeightModal: React.FC<BodyWeightModalProps> = ({
	visible,
	onClose,
	onTrack,
}) => {
	const [date, setDate] = useState(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [weight, setWeight] = useState('');
	const [unit, setUnit] = useState('kg'); // 'kg' or 'lbs'
	const [onEmptyStomach, setOnEmptyStomach] = useState(true);
	const weightInputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (visible) {
			// Reset state when modal becomes visible
			setDate(new Date());
			setWeight('');
			setUnit('kg');
			setOnEmptyStomach(true);
			// Auto-focus input and open keyboard
			setTimeout(() => {
				weightInputRef.current?.focus();
			}, 300); // Small delay to ensure modal is fully rendered
		}
	}, [visible]);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirmDate = (selectedDate: Date) => {
		setDate(selectedDate);
		hideDatePicker();
	};

	const handleWeightInputChange = (text: string) => {
		const cleanedText = text.replace(/[^0-9.]/g, ''); // Allow only numbers and a decimal point
		setWeight(cleanedText);
		if (cleanedText.length === 3 && !cleanedText.includes('.')) {
			// Dismiss if 3 digits and not a decimal part
			Keyboard.dismiss();
		}
		// If you want to limit to 3 digits before decimal:
		// const parts = cleanedText.split('.');
		// if (parts[0].length === 3) {
		//     Keyboard.dismiss();
		// }
	};

	const handleTrack = () => {
		if (weight.trim()) {
			onTrack(weight, unit, date, onEmptyStomach);
		}
	};

	const formattedDate = () => {
		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		};
		return date.toLocaleDateString('en-GB', options).replace(/ /g, '-'); // e.g., 09-May-2025
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoidingContainer}
				enabled
			>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback
							onPress={() => {
								/* Prevent closing when clicking inside content */
							}}
						>
							<View style={styles.modalContent}>
								<TouchableOpacity style={styles.closeButton} onPress={onClose}>
									<Feather name="x" size={24} color="#8E8E93" />
								</TouchableOpacity>

								<View style={styles.datePickerContainer}>
									<TouchableOpacity
										onPress={showDatePicker}
										style={styles.dateDisplay}
									>
										<Feather
											name="calendar"
											size={20}
											color="#FF9500"
											style={styles.calendarIcon}
										/>
										<Text style={styles.dateText}>{formattedDate()}</Text>
									</TouchableOpacity>
								</View>

								<Text style={styles.title}>Track your Body weight Now</Text>

								<View style={styles.unitSelector}>
									<TouchableOpacity
										style={[
											styles.unitButton,
											unit === 'kg' && styles.selectedUnitButton,
										]}
										onPress={() => setUnit('kg')}
									>
										<Text
											style={[
												styles.unitButtonText,
												unit === 'kg' && styles.selectedUnitButtonText,
											]}
										>
											Kg
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.unitButton,
											unit === 'lbs' && styles.selectedUnitButton,
										]}
										onPress={() => setUnit('lbs')}
									>
										<Text
											style={[
												styles.unitButtonText,
												unit === 'lbs' && styles.selectedUnitButtonText,
											]}
										>
											Lbs
										</Text>
									</TouchableOpacity>
								</View>

								<TextInput
									ref={weightInputRef}
									style={styles.weightInput}
									placeholder="Enter your body weight"
									placeholderTextColor="#555"
									value={weight}
									onChangeText={handleWeightInputChange}
									keyboardType="decimal-pad"
									returnKeyType="done"
									onSubmitEditing={Keyboard.dismiss}
								/>

								<TouchableOpacity
									style={styles.checkboxContainer}
									onPress={() => setOnEmptyStomach(!onEmptyStomach)}
									activeOpacity={0.7}
								>
									<View
										style={[
											styles.checkbox,
											onEmptyStomach && styles.checkboxChecked,
										]}
									>
										{onEmptyStomach && (
											<Feather name="check" size={14} color="black" />
										)}
									</View>
									<Text style={styles.checkboxLabel}>ON Empty Stomach</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.trackButton}
									onPress={handleTrack}
								>
									<Text style={styles.trackButtonText}>Track</Text>
								</TouchableOpacity>

								<DateTimePickerModal
									isVisible={isDatePickerVisible}
									mode="date"
									onConfirm={handleConfirmDate}
									onCancel={hideDatePicker}
									date={date} // Pass current date to picker
								/>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingContainer: {
		// Style for the KeyboardAvoidingView itself
		flex: 1, // Ensures it takes up the full screen to manage view adjustments properly
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker, more blurred effect
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '90%',
		backgroundColor: '#1C1C1E', // Dark background like the image
		borderRadius: 20,
		padding: 25,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButton: {
		position: 'absolute',
		top: 15,
		left: 15,
		padding: 8, // Added padding for touch area and for centering icon
		backgroundColor: '#2C2C2E', // Dark grey background
		borderRadius: 15, // Make it circular (half of width/height if they were fixed)
		zIndex: 1, // Ensure it's above other modal content if necessary
	},
	datePickerContainer: {
		alignSelf: 'flex-end',
		marginBottom: 20,
	},
	dateDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
	calendarIcon: {
		marginRight: 8,
	},
	dateText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
	},
	title: {
		color: 'white',
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 25, // Increased margin
		alignSelf: 'stretch', // Ensure it takes full width for text align center
	},
	unitSelector: {
		flexDirection: 'row',
		backgroundColor: 'white', // White background for the selector itself
		borderRadius: 10,
		overflow: 'hidden',
		marginBottom: 25, // Increased margin
		height: 45, // Fixed height
		width: '100%',
	},
	unitButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10, // Adjusted padding
	},
	selectedUnitButton: {
		backgroundColor: 'black', // Selected unit background
	},
	unitButtonText: {
		color: 'black', // Text color for unselected
		fontSize: 16,
		fontWeight: 'bold',
	},
	selectedUnitButtonText: {
		color: 'white', // Text color for selected
	},
	weightInput: {
		width: '100%',
		height: 55, // Increased height
		backgroundColor: '#2C2C2E', // Darker input background
		borderRadius: 10,
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
		paddingHorizontal: 15,
		marginBottom: 25, // Increased margin
		borderWidth: 1,
		borderColor: '#FF9500', // Orange border as in image
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start', // Align to the left
		marginBottom: 30, // Increased margin
		marginLeft: 5, // Small indent
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 5, // Slightly rounded square
		borderWidth: 1.5,
		borderColor: '#8E8E93', // Grey border
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		backgroundColor: 'transparent', // Ensure background is transparent for the checkmark
	},
	checkboxChecked: {
		backgroundColor: '#FF9500', // Orange background when checked
		borderColor: '#FF9500', // Orange border when checked
	},
	checkboxLabel: {
		color: 'white',
		fontSize: 15,
	},
	trackButton: {
		backgroundColor: '#FF6B00', // Orange button color
		borderRadius: 12,
		paddingVertical: 15, // Increased padding
		width: '100%',
		alignItems: 'center',
	},
	trackButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default BodyWeightModal;
