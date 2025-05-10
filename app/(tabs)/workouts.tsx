import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
import ActionButton from '../components/ActionButton';
import { DocumentIcon, SearchIcon } from '../components/Icons';
import WorkoutCard from '../components/WorkoutCard';

export default function WorkoutsScreen() {
	const router = useRouter();
	// Placeholder for workout data
	const pastWorkouts = [
		{ id: '1', name: 'Workout Name', date: '09-may-2025', exerciseCount: 9 },
		{ id: '2', name: 'Workout Name', date: '09-may-2025', exerciseCount: 9 },
		{ id: '3', name: 'Workout Name', date: '09-may-2025', exerciseCount: 12 },
	];

	const startNewWorkout = () => {
		router.push('/(tabs)/track-workout');
	};

	return (
		<LinearGradient colors={['#0057FF', '#0073E6']} style={styles.gradient}>
			<BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
			<SafeAreaView style={styles.safeArea}>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#000000"
					translucent={Platform.OS === 'android'}
				/>

				<View style={styles.container}>
					<View style={styles.header}>
						<View style={styles.profilePic} />
						<Text style={styles.screenTitle}>Workouts</Text>
						<TouchableOpacity style={styles.notificationButton}>
							<Feather name="bell" size={24} color="white" />
						</TouchableOpacity>
					</View>

					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContentContainer}
						showsVerticalScrollIndicator={false}
					>
						<TouchableOpacity
							style={styles.startWorkoutButton}
							activeOpacity={0.8}
							onPress={startNewWorkout}
						>
							<Text style={styles.startWorkoutText}>Start New Workout +</Text>
						</TouchableOpacity>

						<View style={styles.actionButtonsContainer}>
							<ActionButton
								title="New Routine"
								onPress={() => {}}
								icon={<DocumentIcon />}
								style={styles.actionButton}
							/>
							<ActionButton
								title="Explore Routine"
								onPress={() => {}}
								icon={<SearchIcon />}
								style={styles.actionButton}
							/>
						</View>

						<Text style={styles.sectionTitle}>past workouts performed</Text>

						{pastWorkouts.map((workout) => (
							<WorkoutCard
								key={workout.id}
								name={workout.name}
								date={workout.date}
								exerciseCount={workout.exerciseCount}
							/>
						))}

						{/* Extra space to ensure content isn't cut off by tab bar */}
						<View style={{ height: 100 }} />
					</ScrollView>
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginTop: Platform.OS === 'ios' ? 0 : 20,
		marginBottom: 20,
	},
	profilePic: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#E5E5E5',
	},
	notificationButton: {
		padding: 8,
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
	},
	screenTitle: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContentContainer: {
		paddingTop: 10,
	},
	startWorkoutButton: {
		backgroundColor: '#FF5722',
		borderRadius: 16,
		padding: 16,
		marginBottom: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	startWorkoutText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	actionButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	actionButton: {
		width: '48%',
	},
	sectionTitle: {
		color: '#999',
		fontSize: 16,
		marginBottom: 16,
	},
});
