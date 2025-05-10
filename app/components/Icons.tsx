import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const NotificationIcon = () => {
	return (
		<View style={styles.notificationContainer}>
			<Ionicons name="notifications-outline" size={24} color="#FF5722" />
		</View>
	);
};

export const DocumentIcon = () => {
	return <Feather name="file-text" size={32} color="#999" />;
};

export const SearchIcon = () => {
	return <Feather name="search" size={32} color="#999" />;
};

export const AddIcon = () => {
	return <Feather name="plus" size={24} color="white" />;
};

export const DumbbellIcon = () => {
	return <Ionicons name="barbell-outline" size={24} color="#999" />;
};

const styles = StyleSheet.create({
	notificationContainer: {
		backgroundColor: '#1C1C1E',
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
