import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView, // Add Platform
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg'; // Add react-native-svg imports

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
const userName = 'Dinesh Nikhil';
const currentWeight = '105';
const padding = 20; // Moved padding to module scope

// const days = [
// 	{ dayName: 'Thu', date: '1', isCurrent: false },
// 	{ dayName: 'Fri', date: '2', isCurrent: false },
// 	{ dayName: 'Sat', date: '3', isCurrent: false },
// 	{ dayName: 'Sun', date: '4', isCurrent: false },
// 	{ dayName: 'Mon', date: '5', isCurrent: false },
// 	{ dayName: 'Tue', date: '6', isCurrent: false },
// 	{ dayName: 'Wed', date: '7', isCurrent: true },
// ]; // Remove static days

// REMOVE THE OLD PLACEHOLDER BodyWeightGraph component:
// const BodyWeightGraph = () => (
// 	<View style={styles.graphPlaceholder}>
// 		<Text style={styles.graphPlaceholderText}>Body Weight Graph Area</Text>
// 		{/* Simple line representation */}
// 		<View style={styles.graphLine}>
// 			<View style={[styles.graphPoint, { top: 30, left: 20 }]} />
// 			<View style={[styles.graphPoint, { top: 50, left: 70 }]} />
// 			<View style={[styles.graphPoint, { top: 20, left: 120 }]} />
// 			<View style={[styles.graphPoint, { top: 60, left: 170 }]} />
// 			<View style={[styles.graphPoint, { top: 40, left: 220 }]} />
// 		</View>
// 	</View>
// );

// Updated BodyWeightGraph component (this one should remain)
const BodyWeightGraph = () => {
	// Generate dates for the last 7 days
	const generateLast7DaysDates = () => {
		const dates = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
		}
		return dates;
	};

	const last7Days = generateLast7DaysDates();

	// Dummy weight data for the last 7 days - replace with actual data fetching
	const weightData = [
		{ date: last7Days[0], weight_kg: 91.5 },
		{ date: last7Days[1], weight_kg: 91.3 },
		{ date: last7Days[2], weight_kg: 91.2 },
		{ date: last7Days[3], weight_kg: 93.0 },
		{ date: last7Days[4], weight_kg: 90.8 },
		{ date: last7Days[5], weight_kg: 90.6 },
		{ date: last7Days[6], weight_kg: 90.4 },
	];

	const graphWidth = 300; // Adjust as needed
	const graphHeight = 120; // Adjust as needed
	// const padding = 20; // Remove from here, now defined in module scope

	const maxWeight = Math.max(...weightData.map(d => d.weight_kg), 0) + 2; // Add some padding
	const minWeight = Math.min(...weightData.map(d => d.weight_kg), Infinity) - 2; // Add some padding

	// Function to scale data points to graph coordinates
	const getX = (index) => (index / (weightData.length - 1)) * (graphWidth - 2 * padding) + padding;
	const getY = (weight) => graphHeight - ((weight - minWeight) / (maxWeight - minWeight)) * (graphHeight - 2 * padding) - padding;

	let pathD = "M";
	weightData.forEach((point, index) => {
		const x = getX(index);
		const y = getY(point.weight_kg);
		pathD += `${x},${y} `;
	});

	return (
		<View style={styles.graphContainer}>
			<Svg height={graphHeight} width={graphWidth}>
				{/* Optional: Add Y-axis grid lines (dashed) */}
				{[...Array(5)].map((_, i) => (
					<Line
						key={`grid-${i}`}
						x1={padding}
						y1={padding + (i * (graphHeight - 2 * padding)) / 4}
						x2={graphWidth - padding}
						y2={padding + (i * (graphHeight - 2 * padding)) / 4}
						stroke="#3A3A3C" // Grid line color
						strokeDasharray="4, 4" // Dashed line
						strokeWidth="1"
					/>
				))}

				{/* Data Path */}
				<Path d={pathD.trim()} fill="none" stroke="#FF6B00" strokeWidth="2.5" />

				{/* Data Points (Circles) */}
				{weightData.map((point, index) => (
					<Circle
						key={`point-${index}`}
						cx={getX(index)}
						cy={getY(point.weight_kg)}
						r="4"
						fill="#FF6B00"
					/>
				))}
			</Svg>
			{/* Optional: X-axis labels (dates) - simplified */}
			<View style={styles.xAxisLabelsContainer}>
				{weightData.map((point, index) => (
					<Text key={`label-${index}`} style={styles.xAxisLabel}>
						{new Date(point.date).getDate()} {/* Display just the day number */}
					</Text>
				))}
			</View>
		</View>
	);
};

export default function HomeScreen() {
	const days = generateCalendarDays(); // Generate dynamic days

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.profileInfo}>
						<View style={styles.profilePicPlaceholder} />
						<View>
							<Text style={styles.greetingText}>Good Morning,</Text>
							<Text style={styles.userNameText}>{userName}</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.notificationButton}>
						<Feather name="bell" size={24} color="white" />
					</TouchableOpacity>
				</View>

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
						<TouchableOpacity style={styles.timeRangeButton}>
							<Text style={styles.timeRangeText}>Week</Text>
							<Feather name="chevron-down" size={16} color="#8E8E93" />
						</TouchableOpacity>
					</View>
					<BodyWeightGraph />
					<View style={styles.currentWeightContainer}>
						<View>
							<Text style={styles.currentWeightLabel}>Current Weight</Text>
							<View style={styles.weightValueContainer}>
								<Text style={styles.currentWeightValue}>{currentWeight}</Text>
								<Text style={styles.currentWeightUnit}>kg</Text>
							</View>
						</View>
						<TouchableOpacity style={styles.trackTodayButton}>
							<Text style={styles.trackTodayButtonText}>track today</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* Start Workout Button */}
			<TouchableOpacity style={styles.startWorkoutButton} onPress={() => { /* Navigate to workout screen */ }}>
				<Text style={styles.startWorkoutButtonText}>Start workout</Text>
				<Feather name="plus" size={20} color="white" style={styles.plusIcon} />
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#000000',
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Add this line
	},
	container: {
		flex: 1,
	},
	scrollContentContainer: {
		paddingBottom: 100, // To make space for the fixed button
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		// paddingTop: 20, // We'll rely on SafeAreaView or the new paddingTop in safeArea for top spacing
		marginTop: Platform.OS === 'ios' ? 0 : 20, // Keep or adjust marginTop for Android if needed after safeArea padding
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
		backgroundColor: '#3A3A3C', // Placeholder color
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
		backgroundColor: '#1C1C1E',
		borderRadius: 20,
	},
	calendarContainer: {
		marginBottom: 20,
		paddingLeft: 20,
	},
	dayItem: {
		backgroundColor: '#1C1C1E',
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 15,
		alignItems: 'center',
		marginRight: 10,
		minWidth: 50,
	},
	currentDayItem: {
		backgroundColor: '#FF6B00', // Orange color for current day
	},
	dayNameText: {
		color: '#8E8E93',
		fontSize: 12,
		marginBottom: 4,
	},
	currentDayNameText: {
		color: 'white',
	},
	dateText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	currentDateText: {
		color: 'white',
	},
	card: {
		backgroundColor: '#1C1C1E',
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
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	timeRangeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#2C2C2E',
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
	},
	timeRangeText: {
		color: 'white',
		fontSize: 12,
		marginRight: 4,
	},
	graphPlaceholder: {
		// height: 150, // Remove or adjust if graphContainer takes over
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#3A3A3C',
		marginBottom: 15,
		// position: 'relative', // No longer needed for placeholder points
	},
	// graphPlaceholderText: { // No longer needed
	// 	color: '#555',
	// 	fontSize: 14,
	// },
	// graphLine: { // No longer needed
	// 	position: 'absolute',
	// 	width: '90%',
	// 	height: 2,
	// 	backgroundColor: '#FF6B00',
	// 	bottom: 50, // Adjust as needed
	// 	alignSelf: 'center',
	// },
	// graphPoint: { // No longer needed
	// 	width: 8,
	// 	height: 8,
	// 	borderRadius: 4,
	// 	backgroundColor: '#FF6B00',
	// 	position: 'absolute',
	// },
	graphContainer: {
		alignItems: 'center', // Center the SVG graph
		marginBottom: 15,
        // borderBottomWidth: 1, // Keep if you want the line below the graph area
        // borderBottomColor: '#3A3A3C', // Keep if you want the line below the graph area
	},
	xAxisLabelsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%', // Or graphWidth if you want labels aligned with SVG
		paddingHorizontal: padding - 10, // Now 'padding' is accessible from module scope
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
		color: '#8E8E93',
		fontSize: 12,
		marginBottom: 4,
	},
	weightValueContainer: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	currentWeightValue: {
		color: 'white',
		fontSize: 36,
		fontWeight: 'bold',
	},
	currentWeightUnit: {
		color: '#8E8E93',
		fontSize: 16,
		marginLeft: 4,
		marginBottom: 5,
	},
	trackTodayButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	trackTodayButtonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold',
	},
	startWorkoutButton: {
		backgroundColor: '#FF6B00',
		borderRadius: 25,
		paddingVertical: 15,
		marginHorizontal: 40,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 30,
		left: 0,
		right: 0,
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
});