import React from 'react';
import {
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';

type ActionButtonProps = {
	title: string;
	onPress: () => void;
	icon?: React.ReactNode;
	style?: ViewStyle;
	textStyle?: TextStyle;
	fullWidth?: boolean;
};

const ActionButton = ({
	title,
	onPress,
	icon,
	style,
	textStyle,
	fullWidth = false,
}: ActionButtonProps) => {
	return (
		<TouchableOpacity
			style={[styles.button, fullWidth && styles.fullWidth, style]}
			onPress={onPress}
		>
			{icon}
			<Text style={[styles.buttonText, textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#E3FFA8',
		borderRadius: 16,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		minHeight: 150,
	},
	fullWidth: {
		width: '100%',
		backgroundColor: '#0073E6',
	},
	buttonText: {
		color: '#272C36',
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 16,
		textAlign: 'center',
	},
});

export default ActionButton;
