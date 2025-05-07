import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

interface WeightStepProps {
	weight: { value: string; unit: string };
	updateWeight: (weight: { value: string; unit: string }) => void;
	onContinue: () => void;
}

const WeightStep: React.FC<WeightStepProps> = ({
	weight,
	updateWeight,
	onContinue,
}) => {
	const [weightValue, setWeightValue] = useState(weight.value);
	const [unit, setUnit] = useState(weight.unit);
	const [isFocused, setIsFocused] = useState(false);

	const weightInputRef = useRef<TextInput>(null);

	useFocusEffect(
		useCallback(() => {
			// Automatically focus the weight input when the screen comes into focus
			const timer = setTimeout(() => {
				weightInputRef.current?.focus();
			}, 500); // Delay to ensure screen transition is complete

			return () => clearTimeout(timer); // Cleanup the timer when the screen goes out of focus
		}, [])
	);

	const handleWeightChange = (text: string) => {
		const newValue = text.replace(/[^0-9.]/g, '');
		setWeightValue(newValue);
		updateWeight({ value: newValue, unit });
	};

	const selectUnit = (selectedUnit: string) => {
		setUnit(selectedUnit);
		updateWeight({ value: weightValue, unit: selectedUnit });
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>What is your weight?</Text>

			<View style={styles.unitSelector}>
				<TouchableOpacity
					style={[styles.unitButton, unit === 'kg' && styles.selectedUnit]}
					onPress={() => selectUnit('kg')}
				>
					<Text style={styles.unitText}>Kg</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.unitButton, unit === 'lbs' && styles.selectedUnit]}
					onPress={() => selectUnit('lbs')}
				>
					<Text style={styles.unitText}>Lbs</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.inputContainer}>
				<TextInput
					ref={weightInputRef}
					style={[styles.weightInput, isFocused && styles.focusedInput]}
					placeholder="Weight"
					placeholderTextColor="#777"
					value={weightValue}
					onChangeText={handleWeightChange}
					keyboardType="decimal-pad"
					onFocus={handleFocus}
					onBlur={handleBlur}
					returnKeyType="done"
					onSubmitEditing={Keyboard.dismiss}
				/>
			</View>

			<TouchableOpacity
				style={styles.continueButton}
				onPress={onContinue}
				disabled={!weightValue.trim()}
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
		color: 'white',
		textAlign: 'center',
		marginTop: 60,
	},
	unitSelector: {
		flexDirection: 'row',
		borderRadius: 10,
		overflow: 'hidden',
		marginVertical: 20,
		backgroundColor: 'white',
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	unitButton: {
		flex: 1,
		paddingVertical: 15,
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 10,
	},
	selectedUnit: {
		backgroundColor: '#FF5722',
	},
	unitText: {
		color: 'black',
		fontSize: 16,
		fontWeight: 'bold',
	},
	inputContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 200,
	},
	weightInput: {
		width: '100%',
		height: 60,
		borderWidth: 1,
		borderColor: '#333',
		borderRadius: 10,
		backgroundColor: '#1C1C1E',
		color: 'white',
		fontSize: 18,
		textAlign: 'center',
	},
	focusedInput: {
		borderColor: '#FF5722',
		borderWidth: 2,
	},
	continueButton: {
		backgroundColor: '#FF5722',
		borderRadius: 30,
		paddingVertical: 15,
		alignItems: 'center',
		marginBottom: 40,
	},
	continueText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default WeightStep;
