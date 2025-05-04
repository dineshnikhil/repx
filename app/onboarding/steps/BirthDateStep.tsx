import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
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

	const handleMonthChange = (text: string) => {
		setMonth(text);
		updateBirthDate({ month: text, day, year });
	};

	const handleDayChange = (text: string) => {
		setDay(text);
		updateBirthDate({ month, day: text, year });
	};

	const handleYearChange = (text: string) => {
		setYear(text);
		updateBirthDate({ month, day, year: text });
	};

	const isFormValid = () => {
		return month.trim() !== '' && day.trim() !== '' && year.trim() !== '';
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>When have you born?</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Date of Birth</Text>

				<View style={styles.inputRow}>
					<TouchableOpacity
						style={[
							styles.inputField,
							month ? styles.selectedInputField : null,
						]}
						activeOpacity={0.8}
					>
						<TextInput
							style={styles.input}
							placeholder="Month"
							placeholderTextColor="#777"
							value={month}
							onChangeText={handleMonthChange}
							keyboardType="number-pad"
							maxLength={2}
						/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.inputField} activeOpacity={0.8}>
						<TextInput
							style={styles.input}
							placeholder="Day"
							placeholderTextColor="#777"
							value={day}
							onChangeText={handleDayChange}
							keyboardType="number-pad"
							maxLength={2}
						/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.inputField} activeOpacity={0.8}>
						<TextInput
							style={styles.input}
							placeholder="Year"
							placeholderTextColor="#777"
							value={year}
							onChangeText={handleYearChange}
							keyboardType="number-pad"
							maxLength={4}
						/>
					</TouchableOpacity>
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
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 60,
	},
	inputContainer: {
		marginTop: 80,
	},
	inputLabel: {
		color: 'white',
		fontSize: 16,
		marginBottom: 20,
	},
	inputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 40,
	},
	inputField: {
		width: '30%',
		height: 70,
		borderWidth: 2,
		borderColor: '#333',
		borderRadius: 10,
		justifyContent: 'center',
		paddingHorizontal: 10,
	},
	selectedInputField: {
		borderColor: '#E84118',
	},
	input: {
		color: 'white',
		fontSize: 18,
		textAlign: 'center',
	},
	continueButton: {
		backgroundColor: '#E84118',
		borderRadius: 30,
		paddingVertical: 18,
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 40,
	},
	disabledButton: {
		backgroundColor: '#444',
	},
	continueText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default BirthDateStep;
