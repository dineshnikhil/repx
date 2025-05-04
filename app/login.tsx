import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export default function LoginScreen() {
	const [email, setEmail] = useState('dineshkumarpokkula@gmail.com');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const handleLogin = () => {
		// For now, just navigate to loading screen
		router.push('/loading');
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			{/* Back button */}
			<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
				<AntDesign name="left" size={24} color="white" />
			</TouchableOpacity>

			<Text style={styles.title}>Login to your account</Text>

			<View style={styles.formContainer}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Your Number / email address</Text>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholderTextColor="#666"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Enter your Password</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						placeholderTextColor="#666"
					/>
				</View>

				<View style={styles.rememberContainer}>
					<TouchableOpacity
						style={styles.checkboxContainer}
						onPress={() => setRememberMe(!rememberMe)}
					>
						<View
							style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
						>
							{rememberMe && <AntDesign name="check" size={16} color="white" />}
						</View>
						<Text style={styles.checkboxLabel}>Remember me</Text>
					</TouchableOpacity>

					<TouchableOpacity>
						<Text style={styles.forgotPassword}>Forget Password</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
					<Text style={styles.loginButtonText}>Log In</Text>
				</TouchableOpacity>

				<Text style={styles.orText}>or</Text>

				<TouchableOpacity style={styles.socialButton}>
					<Image
						source={{
							uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
						}}
						style={styles.socialIcon}
					/>
					<Text style={styles.socialButtonText}>Sign up with google</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.socialButton}>
					<Image
						source={{
							uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png',
						}}
						style={styles.socialIcon}
					/>
					<Text style={styles.socialButtonText}>Sign up with facebook</Text>
				</TouchableOpacity>

				<View style={styles.accountToggleContainer}>
					<Text style={styles.accountToggleText}>Don't have an account?</Text>
					<TouchableOpacity onPress={() => router.push('/register')}>
						<Text style={styles.accountToggleLink}>Create an account</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		padding: 20,
	},
	backButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#1C1C1E',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
		marginTop: 20,
	},
	formContainer: {
		flex: 1,
		paddingHorizontal: 10,
	},
	title: {
		fontSize: 40,
		fontWeight: '600',
		color: '#FFF',
		marginBottom: 40,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		color: '#FFF',
		fontSize: 16,
		marginBottom: 10,
	},
	input: {
		backgroundColor: '#111',
		borderWidth: 1,
		borderColor: '#FF6B00',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		color: '#FFF',
		fontSize: 16,
	},
	rememberContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 20,
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 1,
		borderColor: '#555',
		borderRadius: 4,
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: '#FF6B00',
		borderColor: '#FF6B00',
	},
	checkboxLabel: {
		color: '#FFF',
		fontSize: 16,
	},
	forgotPassword: {
		color: '#FF6B00',
		fontSize: 16,
	},
	loginButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		marginVertical: 20,
	},
	loginButtonText: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	orText: {
		color: '#FFF',
		textAlign: 'center',
		fontSize: 16,
		marginVertical: 20,
	},
	socialButton: {
		flexDirection: 'row',
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 15,
	},
	socialIcon: {
		width: 24,
		height: 24,
		marginRight: 10,
	},
	socialButtonText: {
		color: '#FFF',
		fontSize: 16,
	},
	accountToggleContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	accountToggleText: {
		color: '#FFF',
		fontSize: 16,
	},
	accountToggleLink: {
		color: '#FF6B00',
		fontSize: 16,
		marginLeft: 5,
	},
});
