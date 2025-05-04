import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>REPX</Text>
				<Text style={styles.subtitle}>
					Track your progress, achieve your goals
				</Text>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => router.push('/login')}
					>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.secondaryButton]}
						onPress={() => router.push('/register')}
					>
						<Text style={styles.buttonText}>Create Account</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={() => router.back()}>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		width: '80%',
		alignItems: 'center',
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#FF6B00',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 18,
		color: '#FFF',
		textAlign: 'center',
		marginBottom: 50,
	},
	buttonContainer: {
		width: '100%',
		gap: 20,
		marginBottom: 30,
	},
	button: {
		backgroundColor: '#FF6B00',
		padding: 15,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
	},
	secondaryButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#FF6B00',
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	backText: {
		color: '#FFF',
		fontSize: 16,
		marginTop: 20,
	},
});
