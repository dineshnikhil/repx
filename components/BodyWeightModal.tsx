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
				if (weightInputRef.current) {
					weightInputRef.current.focus();
				}
			}, 400); // Increased delay slightly
		} else {
			// Optionally dismiss keyboard when modal is closed
			Keyboard.dismiss();
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
		flex: 1,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '90%',
		backgroundColor: '#1C1C1E', // Dark background for modal content (iOS system dark gray)
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
		padding: 8,
		backgroundColor: '#3A3A3C', // Darker grey for close button background
		borderRadius: 15, 
		zIndex: 1,
	},
	datePickerContainer: {
		alignSelf: 'flex-end',
		marginBottom: 20,
	},
	dateDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E', // Slightly lighter dark gray for date display
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
	calendarIcon: {
		marginRight: 8,
		// color is set by prop, FF9500 in component
	},
	dateText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
	},
	title: {
		color: 'white', // White title text
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 25,
		alignSelf: 'stretch',
	},
	unitSelector: {
		flexDirection: 'row',
		backgroundColor: '#2C2C2E', // Background for the selector container
		borderRadius: 10,
		overflow: 'hidden',
		marginBottom: 25,
		height: 45,
		width: '100%',
	},
	unitButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
	},
	selectedUnitButton: {
		backgroundColor: 'black', // Selected unit background (as per image, Kg is selected and black)
		borderRadius: 8, // Rounded corners for the selected button part
		margin: 2, // Add some margin to make it look inset
	},
	unitButtonText: {
		color: 'white', // Text color for unselected (Lbs in image)
		fontSize: 16,
		fontWeight: 'bold',
	},
	selectedUnitButtonText: {
		color: 'white', // Text color for selected (Kg in image)
	},
	weightInput: {
		width: '100%',
		height: 55,
		backgroundColor: '#1C1C1E', // Same as modal content background
		borderRadius: 10,
		color: 'white', // White text color for input
		fontSize: 16,
		textAlign: 'center',
		paddingHorizontal: 15,
		marginBottom: 25,
		borderWidth: 1,
		borderColor: '#FF9500', // Orange border
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		marginBottom: 30,
		marginLeft: 5,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 5,
		borderWidth: 1.5,
		borderColor: '#8E8E93', // Grey border for unchecked box
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		backgroundColor: 'transparent',
	},
	checkboxChecked: {
		backgroundColor: '#FF9500', // Orange background when checked
		borderColor: '#FF9500',
	},
	checkboxLabel: {
		color: 'white', // White label text
		fontSize: 15,
	},
	trackButton: {
		backgroundColor: '#FF6B00', // Orange button color
		borderRadius: 12,
		paddingVertical: 15,
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
