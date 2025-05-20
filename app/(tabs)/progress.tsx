import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
	Dimensions,
	Modal,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import InteractiveBodyWeightChart from '../../components/InteractiveBodyWeightChart';

const screenWidth = Dimensions.get('window').width;

// Type for dropdown layout
interface DropdownLayout {
	x: number;
	y: number;
	width: number;
	height: number;
}

// Time range options for both charts
const timeRangeOptions = [
	{ label: 'Week', value: 'week', days: 7 },
	{ label: 'Month', value: 'month', days: 30 },
	{ label: '3 Months', value: '3months', days: 90 },
	{ label: '6 Months', value: '6months', days: 180 },
];

// Helper function to generate current week days
const generateCurrentWeekDays = () => {
	const daysArray = [];
	const today = new Date();
	const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6

	// Get the Sunday of the current week
	const startDate = new Date(today);
	startDate.setDate(today.getDate() - currentDayOfWeek);

	const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(startDate);
		currentDate.setDate(startDate.getDate() + i);

		// Generate random volume between 5000 and 20000
		const volume = Math.floor(Math.random() * 15000) + 5000;

		daysArray.push({
			day: dayFormatter.format(currentDate).slice(0, 3), // Get short day name
			date: currentDate.getDate().toString(),
			value: Math.random() * 0.9, // Random height for demonstration
			volume: `${volume.toLocaleString()} kg`, // Formatted volume
		});
	}
	return daysArray;
};

// Generate workout volume data for the current week
const volumeData = generateCurrentWeekDays();

export default function ProgressScreen() {
	const router = useRouter();
	const [workoutRange, setWorkoutRange] = useState(timeRangeOptions[0].value);
	const [bodyWeightRange, setBodyWeightRange] = useState(
		timeRangeOptions[0].value
	);
	const [isWorkoutDropdownVisible, setIsWorkoutDropdownVisible] =
		useState(false);
	const [isBodyWeightDropdownVisible, setIsBodyWeightDropdownVisible] =
		useState(false);
	const [workoutDropdownLayout, setWorkoutDropdownLayout] =
		useState<DropdownLayout | null>(null);
	const [bodyWeightDropdownLayout, setBodyWeightDropdownLayout] =
		useState<DropdownLayout | null>(null);
	const [selectedBar, setSelectedBar] = useState<number | null>(null);

	const workoutRangeRef = useRef<View>(null);
	const bodyWeightRangeRef = useRef<View>(null);

	const handleWorkoutRangePress = () => {
		if (workoutRangeRef.current) {
			workoutRangeRef.current.measure(
				(
					fx: number,
					fy: number,
					width: number,
					height: number,
					px: number,
					py: number
				) => {
					setWorkoutDropdownLayout({ x: px, y: py, width, height });
					setIsWorkoutDropdownVisible(true);
				}
			);
		}
	};

	const handleBodyWeightRangePress = () => {
		if (bodyWeightRangeRef.current) {
			bodyWeightRangeRef.current.measure(
				(
					fx: number,
					fy: number,
					width: number,
					height: number,
					px: number,
					py: number
				) => {
					setBodyWeightDropdownLayout({ x: px, y: py, width, height });
					setIsBodyWeightDropdownVisible(true);
				}
			);
		}
	};

	const getWorkoutRangeLabel = () => {
		return timeRangeOptions.find((opt) => opt.value === workoutRange)?.label;
	};

	const getBodyWeightRangeLabel = () => {
		return timeRangeOptions.find((opt) => opt.value === bodyWeightRange)?.label;
	};

	const handleBarPress = (index: number) => {
		setSelectedBar(selectedBar === index ? null : index);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Ionicons name="chevron-back" size={28} color="#888" />
				</TouchableOpacity>
				<Text style={styles.title}>My Statistics</Text>
				<TouchableOpacity style={styles.alarmButton}>
					<Ionicons name="alarm" size={28} color="#FF5722" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Workout Volume Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>workout Volumn</Text>
						<TouchableOpacity
							ref={workoutRangeRef}
							style={styles.timeRangeButton}
							onPress={handleWorkoutRangePress}
						>
							<Text style={styles.timeRangeText}>{getWorkoutRangeLabel()}</Text>
							<Feather name="chevron-down" size={16} color="#888" />
						</TouchableOpacity>
					</View>

					{/* Bar Chart */}
					<View style={styles.barChartContainer}>
						{selectedBar !== null && (
							<View
								style={[
									styles.volumeTooltip,
									{ left: `${(100 / 7) * selectedBar + 100 / 14}%` },
								]}
							>
								<Text style={styles.volumeLabel}>Volume</Text>
								<Text style={styles.volumeValue}>
									{volumeData[selectedBar].volume}
								</Text>
							</View>
						)}

						{volumeData.map((item, index) => (
							<TouchableOpacity
								key={index}
								style={styles.barColumn}
								onLongPress={() => setSelectedBar(index)}
								onPressOut={() => setSelectedBar(null)}
								delayLongPress={200}
								activeOpacity={0.7}
							>
								<View style={styles.barWrapper}>
									<View style={styles.barBackground}>
										<View
											style={[
												styles.barFill,
												{
													height: `${item.value * 100}%`,
													backgroundColor:
														selectedBar === index ? '#FF8A65' : '#FF5722',
												},
											]}
										/>
									</View>
								</View>

								<Text style={styles.dayNumber}>{item.date}</Text>
								<Text style={styles.dayName}>{item.day}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Body Weight Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Body Weight</Text>
						<TouchableOpacity
							ref={bodyWeightRangeRef}
							style={styles.timeRangeButton}
							onPress={handleBodyWeightRangePress}
						>
							<Text style={styles.timeRangeText}>
								{getBodyWeightRangeLabel()}
							</Text>
							<Feather name="chevron-down" size={16} color="#888" />
						</TouchableOpacity>
					</View>

					{/* Body Weight Chart */}
					<View style={styles.chartContainer}>
						<InteractiveBodyWeightChart selectedRange={bodyWeightRange} />
					</View>
				</View>
			</ScrollView>

			{/* Workout Range Dropdown Modal */}
			<Modal
				transparent={true}
				visible={isWorkoutDropdownVisible}
				onRequestClose={() => setIsWorkoutDropdownVisible(false)}
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.dropdownOverlay}
					activeOpacity={1}
					onPressOut={() => setIsWorkoutDropdownVisible(false)}
				>
					{workoutDropdownLayout && (
						<View
							style={[
								styles.dropdownContainer,
								{
									position: 'absolute',
									top:
										workoutDropdownLayout.y + workoutDropdownLayout.height + 5,
									right:
										screenWidth -
										(workoutDropdownLayout.x + workoutDropdownLayout.width),
								},
							]}
						>
							{timeRangeOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={styles.dropdownItem}
									onPress={() => {
										setWorkoutRange(option.value);
										setIsWorkoutDropdownVisible(false);
									}}
								>
									<Text style={styles.dropdownItemText}>{option.label}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</TouchableOpacity>
			</Modal>

			{/* Body Weight Range Dropdown Modal */}
			<Modal
				transparent={true}
				visible={isBodyWeightDropdownVisible}
				onRequestClose={() => setIsBodyWeightDropdownVisible(false)}
				animationType="fade"
			>
				<TouchableOpacity
					style={styles.dropdownOverlay}
					activeOpacity={1}
					onPressOut={() => setIsBodyWeightDropdownVisible(false)}
				>
					{bodyWeightDropdownLayout && (
						<View
							style={[
								styles.dropdownContainer,
								{
									position: 'absolute',
									top:
										bodyWeightDropdownLayout.y +
										bodyWeightDropdownLayout.height +
										5,
									right:
										screenWidth -
										(bodyWeightDropdownLayout.x +
											bodyWeightDropdownLayout.width),
								},
							]}
						>
							{timeRangeOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={styles.dropdownItem}
									onPress={() => {
										setBodyWeightRange(option.value);
										setIsBodyWeightDropdownVisible(false);
									}}
								>
									<Text style={styles.dropdownItemText}>{option.label}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</TouchableOpacity>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#000000',
	},
	container: {
		flex: 1,
		paddingHorizontal: 15,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: '#333',
	},
	backButton: {
		padding: 5,
	},
	title: {
		color: 'white',
		fontSize: 22,
		fontWeight: 'bold',
	},
	alarmButton: {
		padding: 5,
	},
	section: {
		backgroundColor: '#121212',
		borderRadius: 15,
		padding: 15,
		marginVertical: 10,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	sectionTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	timeRangeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#222',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 15,
	},
	timeRangeText: {
		color: 'white',
		fontSize: 14,
		marginRight: 5,
	},
	barChartContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		height: 220,
		paddingTop: 20,
		position: 'relative',
	},
	barColumn: {
		alignItems: 'center',
		flex: 1,
	},
	barWrapper: {
		height: 140,
		width: 30,
		justifyContent: 'flex-end',
	},
	barBackground: {
		width: '100%',
		height: '100%',
		borderRadius: 15,
		backgroundColor: '#461A00',
		overflow: 'hidden',
	},
	barFill: {
		width: '100%',
		borderRadius: 15,
		backgroundColor: '#FF5722',
		position: 'absolute',
		bottom: 0,
	},
	dayNumber: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 6,
	},
	dayName: {
		color: '#888',
		fontSize: 12,
	},
	chartContainer: {
		height: 220,
	},
	dropdownOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	dropdownContainer: {
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		paddingVertical: 4,
		width: 135,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	dropdownItem: {
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	dropdownItemText: {
		color: 'white',
		fontSize: 13,
	},
	volumeTooltip: {
		position: 'absolute',
		top: '40%',
		transform: [{ translateX: -60 }],
		backgroundColor: 'rgba(20, 20, 20, 0.85)',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		alignItems: 'center',
		zIndex: 10,
		width: 120,
	},
	volumeLabel: {
		color: '#999',
		fontSize: 14,
		marginBottom: 4,
		textAlign: 'center',
	},
	volumeValue: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
