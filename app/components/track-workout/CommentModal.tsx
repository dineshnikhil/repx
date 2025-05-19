import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

interface CommentModalProps {
	isVisible: boolean;
	commentText: string;
	onChangeText: (text: string) => void;
	onSave: () => void;
	onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
	isVisible,
	commentText,
	onChangeText,
	onSave,
	onClose,
}) => {
	// Create a ref for the TextInput
	const inputRef = useRef<TextInput>(null);

	// Focus the TextInput when the modal becomes visible
	useEffect(() => {
		if (isVisible && inputRef.current) {
			// Add a small delay to ensure the modal is fully visible before focusing
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [isVisible]);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalContainer}>
					<TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
						<Ionicons name="close-circle" size={28} color="#777" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Add your comment for exercise</Text>
					<TextInput
						ref={inputRef}
						style={styles.modalTextInput}
						placeholder="Enter your comment..."
						placeholderTextColor="#888"
						value={commentText}
						onChangeText={onChangeText}
						multiline={true}
						numberOfLines={4}
						autoFocus={isVisible}
					/>
					<TouchableOpacity style={styles.modalButtonOrange} onPress={onSave}>
						<Text style={styles.modalButtonText}>Add Comment</Text>
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
	modalCloseButton: {
		position: 'absolute',
		top: 10,
		left: 10,
		padding: 5,
		zIndex: 1,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 15,
		textAlign: 'center',
		paddingHorizontal: 35,
	},
	modalTextInput: {
		backgroundColor: '#2C2C2E',
		color: 'white',
		borderRadius: 12,
		padding: 12,
		width: '100%',
		minHeight: 100,
		textAlignVertical: 'top',
		fontSize: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#444',
	},
	modalButtonOrange: {
		backgroundColor: '#FF5722',
		borderRadius: 16,
		paddingVertical: 14,
		paddingHorizontal: 20,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	modalButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
