import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
	Keyboard,
	Modal,
	Platform,
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
	const inputRef = useRef<TextInput>(null);

	// Use useEffect to focus the input and show keyboard when modal becomes visible
	useEffect(() => {
		if (isVisible) {
			// Use multiple timing approaches to ensure focus works
			// First focus attempt - immediate
			if (inputRef.current) {
				inputRef.current.focus();
			}

			// Second focus attempt - short delay (100ms)
			const timer1 = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
					// On iOS, sometimes we need to explicitly show the keyboard
					if (Platform.OS === 'ios') {
						Keyboard.dismiss();
						inputRef.current.focus();
					}
				}
			}, 100);

			// Third focus attempt - longer delay (300ms) for after animations
			const timer2 = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 300);

			// Final attempt with an even longer delay (600ms)
			const timer3 = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 600);

			return () => {
				clearTimeout(timer1);
				clearTimeout(timer2);
				clearTimeout(timer3);
			};
		}
	}, [isVisible]);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
			onShow={() => {
				// Focus attempt on modal show event
				setTimeout(() => {
					inputRef.current?.focus();
				}, 150);
			}}
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalContainer}>
					<TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
						<Ionicons name="close-circle" size={28} color="#777" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Add your comment for exercise</Text>
					<TextInput
						ref={inputRef}
						autoFocus={true}
						style={styles.modalTextInput}
						placeholder="Enter your comment..."
						placeholderTextColor="#888"
						value={commentText}
						onChangeText={onChangeText}
						multiline={true}
						numberOfLines={4}
						returnKeyType="done"
						onSubmitEditing={() => {
							// onSave(); // Or call save if that's the desired behavior
						}}
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
