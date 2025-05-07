import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExperienceStepProps {
	gender: string | null;
	hasFitnessExperience: boolean | null;
	updateExperience: (hasExperience: boolean) => void;
	onContinue: () => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
	gender,
	hasFitnessExperience,
	updateExperience,
	onContinue,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Do you have pervious fitness experience?</Text>

			<View style={styles.imageContainer}>
				<Image
					source={
						gender === 'female'
							? require('../../../assets/images/wroking-female.png')
							: require('../../../assets/images/working-male.png')
					}
					style={[[styles.MaleImage, gender === 'female' && styles.FemaleImage]]}
					resizeMode="contain"
				/>
			</View>

			<View style={styles.buttonsContainer}>
				<TouchableOpacity
					style={[
						styles.button,
						styles.noButton,
						hasFitnessExperience === false && styles.selectedButton,
					]}
					onPress={() => {
						updateExperience(false);
						onContinue();
					}}
				>
					<Text style={styles.buttonText}>No</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.button,
						styles.yesButton,
						hasFitnessExperience === true && styles.selectedButton,
					]}
					onPress={() => {
						updateExperience(true);
						onContinue();
					}}
				>
					<Text style={styles.buttonText}>Yes</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 50,
		marginBottom: 20,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	MaleImage: {
		width: '100%',
		height: '100%',
	},
	FemaleImage: {
		width: '80%',
		height: '80%',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 40,
	},
	button: {
		width: '48%',
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: 'center',
	},
	noButton: {
		backgroundColor: '#444',
	},
	yesButton: {
		backgroundColor: '#E84118',
	},
	selectedButton: {
		borderWidth: 2,
		borderColor: 'white',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default ExperienceStep;
