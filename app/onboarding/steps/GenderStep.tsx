import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GenderStepProps {
	selectedGender: string | null;
	updateGender: (gender: string) => void;
	onContinue: () => void;
}

const GenderStep: React.FC<GenderStepProps> = ({
	selectedGender,
	updateGender,
	onContinue,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Choose Gender</Text>

			<View style={styles.optionsContainer}>
				<TouchableOpacity
					style={[
						styles.genderOption,
						selectedGender === 'female' && styles.selectedOption,
					]}
					onPress={() => updateGender('female')}
				>
					<Text style={styles.genderText}>Female</Text>
					<Image
						source={require('../../../assets/images/female.png')}
						style={styles.genderImage}
						resizeMode="cover"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.genderOption,
						selectedGender === 'male' && styles.selectedOption,
					]}
					onPress={() => updateGender('male')}
				>
					<Text style={styles.genderText}>Male</Text>
					<Image
						source={require('../../../assets/images/male.png')}
						style={styles.genderImage}
						resizeMode="cover"
					/>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={[
					styles.continueButton,
					!selectedGender && styles.disabledButton,
				]}
				onPress={onContinue}
				disabled={!selectedGender}
			>
				<Text style={styles.continueText}>Continue</Text>
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
		textAlign: 'center',
		marginBottom: 60,
	},
	optionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 60,
	},
	genderOption: {
		width: '47%',
		height: 460,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#444',
		overflow: 'hidden',
		alignItems: 'center',
		padding: 20,
	},
	selectedOption: {
		borderColor: '#E84118',
		borderWidth: 2,
	},
	genderText: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	genderImage: {
		width: '100%',
		height: 380,
		borderRadius: 15,
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

export default GenderStep;
