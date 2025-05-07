import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<View style={styles.logoContainer}>
				<Text style={styles.logoText}>REPX</Text>
			</View>

			<Image
				source={require('../assets/images/bodybuilder_wellcome.png')}
				style={styles.bodybuilderImage}
				resizeMode="contain"
			/>

			<View style={styles.textContainer}>
				<View style={styles.trackRow}>
					<Text style={styles.trackText}>TRACK</Text>
					<Text style={styles.everyRepText}> Every Rep</Text>
				</View>

				<View style={styles.progressRow}>
					<Text style={styles.unlockText}>Unlock your </Text>
					<Text style={styles.progressText}>PROGRESS</Text>
				</View>
			</View>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push('/login')}
			>
				<Text style={styles.buttonText}>Get Started</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 50,
	},
	logoContainer: {
		width: '100%',
		alignItems: 'center',
		marginTop: 30,
	},
	logoText: {
		fontSize: 100,
		fontWeight: 'bold',
		color: '#FFF',
	},
	bodybuilderImage: {
		width: 300,
		height: 350,
	},
	textContainer: {
		width: '80%',
	},
	trackRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	trackText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: '#FF5722',
	},
	everyRepText: {
		fontSize: 28,
		color: '#AAA',
	},
	progressRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	unlockText: {
		fontSize: 28,
		color: '#AAA',
	},
	progressText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: '#FF5722',
	},
	button: {
		backgroundColor: '#FF5722',
		paddingVertical: 16,
		paddingHorizontal: 50,
		borderRadius: 12,
		width: '80%',
		alignItems: 'center',
		marginBottom: 40,
	},
	buttonText: {
		color: '#FFF',
		fontSize: 22,
		fontWeight: 'bold',
	},
});
