import React, { useState } from 'react';
import {
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

	const handleWeightChange = (text: string) => {
		const newValue = text.replace(/[^0-9.]/g, '');
		setWeightValue(newValue);
		updateWeight({ value: newValue, unit });
	};

	const selectUnit = (selectedUnit: string) => {
		setUnit(selectedUnit);
		updateWeight({ value: weightValue, unit: selectedUnit });
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
					style={styles.weightInput}
					placeholder="Weight"
					placeholderTextColor="#777"
					value={weightValue}
					onChangeText={handleWeightChange}
					keyboardType="decimal-pad"
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
		paddingHorizontal: 20,
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 50,
	},
	unitSelector: {
		flexDirection: 'row',
		borderRadius: 20,
		overflow: 'hidden',
		marginVertical: 50,
	},
	unitButton: {
		flex: 1,
		paddingVertical: 15,
		alignItems: 'center',
		backgroundColor: '#222',
	},
	selectedUnit: {
		backgroundColor: '#1C1C1E',
	},
	unitText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	inputContainer: {
		flex: 1,
		justifyContent: 'center',
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
	continueButton: {
		backgroundColor: '#E84118',
		borderRadius: 30,
		paddingVertical: 18,
		alignItems: 'center',
		marginBottom: 40,
	},
	continueText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default WeightStep;
