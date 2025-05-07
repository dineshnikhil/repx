import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

interface BirthDateStepProps {
	birthDate: { month: string; day: string; year: string };
	updateBirthDate: (birthDate: {
		month: string;
		day: string;
		year: string;
	}) => void;
	onContinue: () => void;
}

const BirthDateStep: React.FC<BirthDateStepProps> = ({
	birthDate,
	updateBirthDate,
	onContinue,
}) => {
	const [month, setMonth] = useState(birthDate.month);
	const [day, setDay] = useState(birthDate.day);
	const [year, setYear] = useState(birthDate.year);
	const [focusedInput, setFocusedInput] = useState<'month' | 'day' | 'year' | null>('month');

	const monthInputRef = useRef<TextInput>(null);
	const dayInputRef = useRef<TextInput>(null);
	const yearInputRef = useRef<TextInput>(null);

	useFocusEffect(
		useCallback(() => {
			// Automatically focus the month input when the screen comes into focus
			const timer = setTimeout(() => {
				monthInputRef.current?.focus();
			}, 500); // Delay to ensure screen transition is complete

			return () => clearTimeout(timer); // Cleanup the timer when the screen goes out of focus
		}, [])
	);

	const handleMonthChange = (text: string) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setMonth(numericText);
		updateBirthDate({ month: numericText, day, year });
		if (numericText.length === 2) {
			dayInputRef.current?.focus();
		}
	};

	const handleDayChange = (text: string) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setDay(numericText);
		updateBirthDate({ month, day: numericText, year });
		if (numericText.length === 2) {
			yearInputRef.current?.focus();
		}
	};

	const handleYearChange = (text: string) => {
		const numericText = text.replace(/[^0-9]/g, '');
		setYear(numericText);
		updateBirthDate({ month, day, year: numericText });
		if (numericText.length === 4) {
			Keyboard.dismiss();
		}
	};
	
	const handleFocus = (input: 'month' | 'day' | 'year') => {
		setFocusedInput(input);
	};
	
	const handleBlur = () => {
		// Keep the focus state if another field is immediately focused
		setTimeout(() => {
			if (!monthInputRef.current?.isFocused() && 
				!dayInputRef.current?.isFocused() && 
				!yearInputRef.current?.isFocused()) {
				setFocusedInput(null);
			}
		}, 100);
	};

	const isFormValid = () => {
		return month.trim().length === 2 && day.trim().length === 2 && year.trim().length === 4;
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>When have you born?</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Date of Birth</Text>

				<View style={styles.inputRow}>
					<TextInput
						ref={monthInputRef}
						style={[
							styles.inputField,
							focusedInput === 'month' && styles.focusedInputField
						]}
						placeholder="Month"
						placeholderTextColor="#777"
						value={month}
						onChangeText={handleMonthChange}
						keyboardType="number-pad"
						maxLength={2}
						returnKeyType="next"
						onSubmitEditing={() => dayInputRef.current?.focus()}
						onFocus={() => handleFocus('month')}
						onBlur={handleBlur}
					/>

					<TextInput
						ref={dayInputRef}
						style={[
							styles.inputField,
							focusedInput === 'day' && styles.focusedInputField
						]}
						placeholder="Day"
						placeholderTextColor="#777"
						value={day}
						onChangeText={handleDayChange}
						keyboardType="number-pad"
						maxLength={2}
						returnKeyType="next"
						onSubmitEditing={() => yearInputRef.current?.focus()}
						onFocus={() => handleFocus('day')}
						onBlur={handleBlur}
					/>

					<TextInput
						ref={yearInputRef}
						style={[
							styles.inputField,
							focusedInput === 'year' && styles.focusedInputField
						]}
						placeholder="Year"
						placeholderTextColor="#777"
						value={year}
						onChangeText={handleYearChange}
						keyboardType="number-pad"
						maxLength={4}
						returnKeyType="done"
						onSubmitEditing={Keyboard.dismiss}
						onFocus={() => handleFocus('year')}
						onBlur={handleBlur}
					/>
				</View>
			</View>

			<TouchableOpacity
				style={[styles.continueButton, !isFormValid() && styles.disabledButton]}
				onPress={onContinue}
				disabled={!isFormValid()}
			>
				<Text style={styles.continueText}>Next Step</Text>
			</TouchableOpacity>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'space-between',
		backgroundColor: '#000000',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 0,
		textAlign: 'center',
		color: 'white',
	},
	inputContainer: {
		marginBottom: 300,
	},
	inputLabel: {
		fontSize: 16,
		marginBottom: 10,
		color: 'white',
	},
	inputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	inputField: {
		height: 50,
		borderWidth: 1,
		borderColor: '#333',
		borderRadius: 8,
		paddingHorizontal: 10,
		fontSize: 16,
		textAlign: 'center',
		width: '30%',
		color: 'white',
		backgroundColor: '#1C1C1E',
	},
	focusedInputField: {
		borderColor: '#FF5722',
		borderWidth: 2,
	},
	continueButton: {
		backgroundColor: '#FF5722',
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 40,
	},
	disabledButton: {
		opacity: 0.7,
	},
	continueText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default BirthDateStep;
