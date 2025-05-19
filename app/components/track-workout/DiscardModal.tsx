import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DiscardModalProps {
	isVisible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const DiscardModal: React.FC<DiscardModalProps> = ({
	isVisible,
	onConfirm,
	onCancel,
}) => {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={onCancel}
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitle}>Discard Workout?</Text>
					<Text style={styles.modalMessage}>
						Are you sure you want to discard the workout in progress?
					</Text>
					<TouchableOpacity
						style={styles.modalButtonDestructive}
						onPress={onConfirm}
					>
						<Text style={styles.modalButtonText}>Discard Workout</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.modalButtonSecondary}
						onPress={onCancel}
					>
						<Text style={styles.modalButtonSecondaryText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		padding: 20,
		width: '90%',
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 15,
		textAlign: 'center',
	},
	modalMessage: {
		fontSize: 16,
		color: '#DDD',
		textAlign: 'center',
		marginBottom: 20,
		lineHeight: 22,
	},
	modalButtonDestructive: {
		backgroundColor: '#D32F2F',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	modalButtonSecondary: {
		backgroundColor: '#3A3A3C',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
	},
	modalButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	modalButtonSecondaryText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
