import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { /* Prevent closing */ }}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Feather name="x" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                                        {cancelButtonText}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={() => {
                                        onConfirm();
                                        onClose(); // Close modal after confirmation
                                    }}
                                >
                                    <Text style={[styles.buttonText, styles.confirmButtonText]}>
                                        {confirmButtonText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better focus
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%', // Slightly wider for better readability
        backgroundColor: '#1C1C1E', // Dark theme background
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5, // Increased shadow for depth
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5, // Easier to tap
    },
    title: {
        fontSize: 20, // Larger title
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for dark theme
        marginBottom: 15, // Increased margin
        textAlign: 'center',
    },
    message: {
        fontSize: 16, // Slightly larger message text
        color: '#E5E5EA', // Light gray text for readability
        textAlign: 'center',
        marginBottom: 25, // Increased margin
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Space out buttons
        width: '100%',
    },
    button: {
        borderRadius: 10, // More rounded buttons
        paddingVertical: 12, // Increased padding
        paddingHorizontal: 20,
        flex: 1, // Make buttons take equal width
        alignItems: 'center',
        marginHorizontal: 5, // Add horizontal margin between buttons
    },
    buttonText: {
        fontSize: 16, // Larger button text
        fontWeight: '600', // Semi-bold
    },
    confirmButton: {
        backgroundColor: '#FF3B30', // iOS red for destructive actions
    },
    confirmButtonText: {
        color: '#FFFFFF',
    },
    cancelButton: {
        backgroundColor: '#3A3A3C', // Dark gray for cancel
    },
    cancelButtonText: {
        color: '#FFFFFF',
    },
});

export default ConfirmationModal;