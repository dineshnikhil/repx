import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	Dimensions,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// Get screen dimensions for proper spacing
const { height } = Dimensions.get('window');

const ProfileScreen = () => {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar
				barStyle="light-content"
				backgroundColor="#1C1C1E"
				translucent={Platform.OS === 'android'}
			/>

			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
					>
						<Feather name="chevron-left" size={28} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Profile</Text>
					<TouchableOpacity style={styles.settingsButton}>
						<Feather name="settings" size={24} color="white" />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollViewContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.profileSection}>
						<View style={styles.profileImageContainer}>
							<View style={styles.profileImage}>
								{/* Profile image placeholder - replace with actual image */}
							</View>
							<View style={styles.verifiedBadge}>
								<Feather
									name="check"
									size={12}
									color="white"
									style={{ marginRight: 4 }}
								/>
								<Text style={styles.badgeText}>Invivo</Text>
							</View>
						</View>

						<Text style={styles.userName}>Olivia Wilson</Text>
						<Text style={styles.userRole}>
							Group Fitness Instructor / personal Trainer at Fitness Life
						</Text>

						<View style={styles.statsContainer}>
							<View style={styles.statCard}>
								<View style={styles.statIconContainer}>
									<Feather name="clock" size={24} color="white" />
								</View>
								<Text style={styles.statValue}>3h 30m</Text>
								<Text style={styles.statLabel}>Total time</Text>
							</View>

							<View style={styles.statCard}>
								<View
									style={[
										styles.statIconContainer,
										{ backgroundColor: '#FF6B00' },
									]}
								>
									<Ionicons name="flame" size={24} color="white" />
								</View>
								<Text style={styles.statValue}>7200 cal</Text>
								<Text style={styles.statLabel}>Burned</Text>
							</View>

							<View style={styles.statCard}>
								<View
									style={[
										styles.statIconContainer,
										{ backgroundColor: '#FFD700' },
									]}
								>
									<Feather name="check-circle" size={24} color="white" />
								</View>
								<Text style={styles.statValue}>05</Text>
								<Text style={styles.statLabel}>Done</Text>
							</View>
						</View>

						<View style={styles.menuContainer}>
							<TouchableOpacity style={styles.menuItem}>
								<View style={styles.menuIconContainer}>
									<Feather name="user" size={20} color="white" />
								</View>
								<Text style={styles.menuText}>Personal</Text>
								<Feather
									name="chevron-right"
									size={20}
									color="#8E8E93"
									style={styles.menuArrow}
								/>
							</TouchableOpacity>

							<TouchableOpacity style={styles.menuItem}>
								<View style={styles.menuIconContainer}>
									<Feather name="settings" size={20} color="white" />
								</View>
								<Text style={styles.menuText}>General</Text>
								<Feather
									name="chevron-right"
									size={20}
									color="#8E8E93"
									style={styles.menuArrow}
								/>
							</TouchableOpacity>

							<TouchableOpacity style={styles.menuItem}>
								<View style={styles.menuIconContainer}>
									<Feather name="bell" size={20} color="white" />
								</View>
								<Text style={styles.menuText}>Notification</Text>
								<Feather
									name="chevron-right"
									size={20}
									color="#8E8E93"
									style={styles.menuArrow}
								/>
							</TouchableOpacity>

							<TouchableOpacity style={styles.menuItem}>
								<View style={styles.menuIconContainer}>
									<Feather name="help-circle" size={20} color="white" />
								</View>
								<Text style={styles.menuText}>Help</Text>
								<Feather
									name="chevron-right"
									size={20}
									color="#8E8E93"
									style={styles.menuArrow}
								/>
							</TouchableOpacity>

							<TouchableOpacity style={styles.menuItem}>
								<View style={styles.menuIconContainer}>
									<Feather name="info" size={20} color="white" />
								</View>
								<Text style={styles.menuText}>About</Text>
								<Feather
									name="chevron-right"
									size={20}
									color="#8E8E93"
									style={styles.menuArrow}
								/>
							</TouchableOpacity>

							{/* Extra space to ensure content isn't cut off by tab bar */}
							<View style={{ height: 100 }} />
						</View>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#1C1C1E',
		// Add padding top for Android to prevent status bar overlap
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	container: {
		flex: 1,
		// Add bottom padding to account for the floating tab bar
		paddingBottom: 0, // We'll handle bottom space in the scrollView
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: 'white',
	},
	settingsButton: {
		padding: 4,
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	scrollViewContent: {
		paddingBottom: 100, // Ensure content has space at bottom
	},
	profileSection: {
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 24,
		width: '100%',
	},
	profileImageContainer: {
		position: 'relative',
		marginBottom: 16,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#FF6B00', // Orange base color for the profile image
		borderWidth: 2,
		borderColor: '#2C2C2E',
		overflow: 'hidden',
	},
	verifiedBadge: {
		position: 'absolute',
		right: 14,
		bottom: 0,
		backgroundColor: '#7E57C2',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 16,
		minWidth: 70,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 3,
	},
	badgeText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	userName: {
		fontSize: 24,
		fontWeight: '600',
		color: 'white',
		marginBottom: 6,
	},
	userRole: {
		fontSize: 14,
		color: '#8E8E93',
		textAlign: 'center',
		marginBottom: 32,
		maxWidth: '80%',
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 32,
	},
	statCard: {
		backgroundColor: '#2C2C2E',
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		width: '30%',
	},
	statIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#6B6B6B',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	statValue: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#8E8E93',
	},
	menuContainer: {
		backgroundColor: '#2C2C2E',
		borderRadius: 16,
		width: '100%',
		padding: 8,
		marginBottom: 20,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	menuIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#3A3A3C',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	menuText: {
		fontSize: 16,
		color: 'white',
		flex: 1,
	},
	menuArrow: {
		marginLeft: 'auto',
	},
});

export default ProfileScreen;
