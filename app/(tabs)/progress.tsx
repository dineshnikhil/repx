import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProgressScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.text}>Progress Screen</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#000000',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: 'white',
		fontSize: 20,
	},
});
