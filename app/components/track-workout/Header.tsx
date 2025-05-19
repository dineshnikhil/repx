import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
	toggleTimer: () => void;
	timerRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
	toggleTimer,
	timerRunning,
}) => {
	const goBack = () => {
		router.push('/(tabs)/workouts');
	};

	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.backButton} onPress={goBack}>
				<Feather name="chevron-left" size={32} color="white" />
			</TouchableOpacity>
			<Text style={styles.headerTitle}>Track Workout</Text>
			<TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
				<Ionicons
					name={timerRunning ? 'alarm' : 'alarm-outline'}
					size={28}
					color="#FF5722"
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	backButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 25,
	},
	headerTitle: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
	timerButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1C1C1E',
		borderRadius: 25,
	},
});
