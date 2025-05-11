import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	Dimensions,
	Modal,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import BodyWeightModal from '../../components/BodyWeightModal';
import InteractiveBodyWeightChart from '../../components/InteractiveBodyWeightChart';

// Helper function to generate dynamic calendar days for the current week
const generateCalendarDays = () => {
	const daysArray = [];
	const today = new Date();
	const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6

	// Adjust to make Monday the start of the week (optional, depends on preference)
	// For this example, let's consider the week starting from Sunday
	const startDate = new Date(today);
	startDate.setDate(today.getDate() - currentDayOfWeek); // Go to the Sunday of the current week

	const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
	const dateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' });

	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(startDate);
		currentDate.setDate(startDate.getDate() + i);

		daysArray.push({
			dayName: dayFormatter.format(currentDate).slice(0, 3), // Get short day name e.g. Mon
			date: dateFormatter.format(currentDate),
			isCurrent: currentDate.toDateString() === today.toDateString(),
		});
	}
	return daysArray;
};

// Placeholder data - replace with actual data later
// const userName = 'Dinesh Nikhil'; // Commented out as it's a state now
const currentWeight = '105';
const padding = 20;

const timeRangeOptions = [
	{ label: 'Week', value: 'week', days: 7 },
	{ label: 'Month', value: 'month', days: 30 },
	{ label: '3 Months', value: '3months', days: 90 },
	{ label: '6 Months', value: '6months', days: 180 },
];

export default function HomeScreen() {
	const router = useRouter();
	const days = generateCalendarDays();
	const [userName, setUserName] = useState('Dinesh Nikhil');
	const [selectedRange, setSelectedRange] = useState(timeRangeOptions[0].value); // Default to 'week'
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [timeRangeButtonLayout, setTimeRangeButtonLayout] = useState(null);
	const timeRangeButtonRef = React.useRef(null);
	const [isBodyWeightModalVisible, setIsBodyWeightModalVisible] =
		useState(false);

	const currentRangeLabel = timeRangeOptions.find(
		(opt) => opt.value === selectedRange
	)?.label;

	const handleTimeRangeButtonPress = () => {
		if (timeRangeButtonRef.current) {
			(timeRangeButtonRef.current as any).measure(
				(
					fx: number,
					fy: number,
					width: number,
					height: number,
					px: number,
					py: number
				) => {
					setTimeRangeButtonLayout({ x: px, y: py, width, height } as any);
					setIsDropdownVisible(true);
				}
			);
		}
	};

	const handleTrackWeight = (
		weight: string,
		unit: string,
		date: Date,
		onEmptyStomach: boolean
	) => {
		console.log('Tracked Data:', {
			weight,
			unit,
			date: date.toISOString(),
			onEmptyStomach,
		});
		// Here you would typically send this data to a backend or store it locally
		setIsBodyWeightModalVisible(false); // Close modal after tracking
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
						<View style={styles.profileInfo}>
							<TouchableOpacity
								style={styles.profilePicPlaceholder}
								onPress={() => router.push('/profile')} // Should navigate to profile tab
								activeOpacity={0.7}
							/>
							<View>
								<Text style={styles.greetingText}>Good Morning,</Text>
								<Text style={styles.userNameText}>{userName}</Text>
							</View>
						</View>
						<TouchableOpacity style={styles.notificationButton}>
							<Feather name="bell" size={24} color="#272C36" />
						</TouchableOpacity>
					</View>

					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContentContainer}
						showsVerticalScrollIndicator={false}
					>
						{/* Calendar */}
						<View style={styles.calendarContainer}>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								{days.map((day, index) => (
									<TouchableOpacity
										key={index}
										style={[
											styles.dayItem,
											day.isCurrent && styles.currentDayItem,
										]}
									>
										<Text
											style={[
												styles.dayNameText,
												day.isCurrent && styles.currentDayNameText,
											]}
										>
											{day.dayName}
										</Text>
										<Text
											style={[
												styles.dateText,
												day.isCurrent && styles.currentDateText,
											]}
										>
											{day.date}
										</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>

						{/* Body Weight Card */}
						<View style={styles.card}>
							<View style={styles.cardHeader}>
								<Text style={styles.cardTitle}>Body Weight</Text>
								<TouchableOpacity
									ref={timeRangeButtonRef}
									style={styles.timeRangeButton}
									onPress={handleTimeRangeButtonPress}
								>
									<Text style={styles.timeRangeText}>{currentRangeLabel}</Text>
									<Feather name="chevron-down" size={16} color="#a1a8b4" />
								</TouchableOpacity>
							</View>
							<InteractiveBodyWeightChart selectedRange={selectedRange} />
							<View style={styles.currentWeightContainer}>
								<View>
									<Text style={styles.currentWeightLabel}>Current Weight</Text>
									<View style={styles.weightValueContainer}>
										<Text style={styles.currentWeightValue}>
											{currentWeight}
										</Text>
										<Text style={styles.currentWeightUnit}>kg</Text>
									</View>
								</View>
								<TouchableOpacity
									style={styles.trackTodayButton}
									onPress={() => setIsBodyWeightModalVisible(true)}
								>
									<Text style={styles.trackTodayButtonText}>track today</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</View>

				{/* Dropdown Modal */}
				<Modal
					transparent={true}
					visible={isDropdownVisible}
					onRequestClose={() => setIsDropdownVisible(false)}
					animationType="fade"
				>
					<TouchableOpacity
						style={styles.dropdownOverlay}
						activeOpacity={1}
						onPressOut={() => setIsDropdownVisible(false)}
					>
						{timeRangeButtonLayout && (
							<View
								style={[
									styles.dropdownContainer,
									{
										position: 'absolute',
										top:
											(timeRangeButtonLayout as { y: number; height: number })
												.y +
											(timeRangeButtonLayout as { y: number; height: number })
												.height +
											5,
										right:
											screenWidth -
											((timeRangeButtonLayout as { x: number; width: number })
												.x +
												(timeRangeButtonLayout as { x: number; width: number })
													.width),
									},
								]}
							>
								{timeRangeOptions.map((option) => (
									<TouchableOpacity
										key={option.value}
										style={styles.dropdownItem}
										onPress={() => {
											setSelectedRange(option.value);
											setIsDropdownVisible(false);
										}}
									>
										<Text style={styles.dropdownItemText}>{option.label}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</TouchableOpacity>
				</Modal>

				{/* Body Weight Tracking Modal */}
				<BodyWeightModal
					visible={isBodyWeightModalVisible}
					onClose={() => setIsBodyWeightModalVisible(false)}
					onTrack={handleTrackWeight}
				/>
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
	scrollView: {
		flex: 1,
	},
	scrollContentContainer: {
		paddingHorizontal: 20,
		paddingBottom: 100,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginTop: Platform.OS === 'ios' ? 0 : 20,
		marginBottom: 20,
	},
	profileInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profilePicPlaceholder: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#3A3A3C',
		marginRight: 12,
	},
	greetingText: {
		color: '#8E8E93',
		fontSize: 14,
	},
	userNameText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	notificationButton: {
		padding: 8,
		backgroundColor: '#e8f0ff',
		borderRadius: 20,
	},
	calendarContainer: {
		marginBottom: 20,
		paddingLeft: 0,
	},
	dayItem: {
		backgroundColor: '#0073E6',
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 15,
		alignItems: 'center',
		marginRight: 10,
		minWidth: 50,
	},
	currentDayItem: {
		backgroundColor: '#e3ffa8',
	},
	dayNameText: {
		color: 'white',
		fontSize: 12,
		marginBottom: 4,
	},
	currentDayNameText: {
		color: '#272c36',
	},
	dateText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	currentDateText: {
		color: '#272c36',
	},
	card: {
		backgroundColor: '#e8f0ff',
		borderRadius: 16,
		marginHorizontal: 20,
		padding: 20,
		marginBottom: 20,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	cardTitle: {
		color: '#272c36',
		fontSize: 18,
		fontWeight: 'bold',
	},
	timeRangeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e8f0ff',
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
	},
	timeRangeText: {
		color: '#272c36',
		fontSize: 12,
		marginRight: 4,
	},
	graphContainer: {
		alignItems: 'center',
		marginBottom: 15,
	},
	xAxisLabelsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		paddingHorizontal: padding - 10,
		marginTop: 5,
	},
	xAxisLabel: {
		fontSize: 10,
		color: '#8E8E93',
	},
	currentWeightContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginTop: 10,
	},
	currentWeightLabel: {
		color: '#a1a8b4',
		fontSize: 12,
		marginBottom: 4,
	},
	weightValueContainer: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	currentWeightValue: {
		color: '#0057FF',
		fontSize: 36,
		fontWeight: 'bold',
	},
	currentWeightUnit: {
		color: '#a1a8b4',
		fontSize: 16,
		marginLeft: 4,
		marginBottom: 5,
	},
	trackTodayButton: {
		backgroundColor: '#0057FF',
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	trackTodayButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold',
	},
	startWorkoutButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 25,
		paddingVertical: 15,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 30,
		right: 0,
		width: screenWidth / 2,
		marginRight: 20,
		marginBottom: 30,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	startWorkoutButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	plusIcon: {
		marginLeft: 8,
	},
	loadingText: {
		color: '#8E8E93',
		textAlign: 'center',
		marginTop: 20,
	},
	// Dropdown Styles
	dropdownOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	dropdownContainer: {
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		paddingVertical: 5,
		width: 150,

		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	dropdownItem: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	dropdownItemText: {
		color: 'white',
		fontSize: 14,
	},
});
