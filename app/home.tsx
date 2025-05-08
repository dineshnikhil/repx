import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
// Remove Svg imports if no longer used elsewhere in this file
// import Svg, { Circle, Line, Path } from 'react-native-svg'; 
import InteractiveBodyWeightChart from '../components/InteractiveBodyWeightChart'; // Adjust path if necessary

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
const padding = 20;

const timeRangeOptions = [
    { label: 'Week', value: 'week', days: 7 },
    { label: 'Month', value: 'month', days: 30 },
    { label: '3 Months', value: '3months', days: 90 },
    { label: '6 Months', value: '6months', days: 180 },
];

// REMOVE THE ENTIRE BodyWeightGraph COMPONENT HERE
// const BodyWeightGraph = ({ selectedRange }: { selectedRange: string }) => { ... };

export default function HomeScreen() {
    const days = generateCalendarDays();
    const [selectedRange, setSelectedRange] = useState(timeRangeOptions[0].value); // Default to 'week'
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [timeRangeButtonLayout, setTimeRangeButtonLayout] = useState(null);
    const timeRangeButtonRef = React.useRef(null);

    const currentRangeLabel = timeRangeOptions.find(opt => opt.value === selectedRange)?.label;

    const handleTimeRangeButtonPress = () => {
        if (timeRangeButtonRef.current) {
            (timeRangeButtonRef.current as any).measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
                setTimeRangeButtonLayout({ x: px, y: py, width, height } as any);
                setIsDropdownVisible(true);
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                {/* ... Header and Calendar ... */}
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
                        <TouchableOpacity 
                            ref={timeRangeButtonRef}
                            style={styles.timeRangeButton}
                            onPress={handleTimeRangeButtonPress} // Updated onPress
                        >
                            <Text style={styles.timeRangeText}>{currentRangeLabel}</Text>
                            <Feather name="chevron-down" size={16} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>
                    {/* Replace BodyWeightGraph with InteractiveBodyWeightChart */}
                    <InteractiveBodyWeightChart selectedRange={selectedRange} />
                    {/* ... Current Weight and Track Today Button ... */}
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
                    {/* Ensure only one child here, conditional rendering wraps the View */}
                    {timeRangeButtonLayout && (
                        <View style={[
                            styles.dropdownContainer,
                            {
                                position: 'absolute',
                                top: (timeRangeButtonLayout as {y: number; height: number}).y + (timeRangeButtonLayout as {y: number; height: number}).height + 5, // 5px gap
                                right: screenWidth - ((timeRangeButtonLayout as {x: number; width: number}).x + (timeRangeButtonLayout as {x: number; width: number}).width),
                            }
                        ]}>
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
        </SafeAreaView>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    scrollContentContainer: {
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
        backgroundColor: '#FF6B00',
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
        // Remove justifyContent and alignItems to allow absolute positioning of child
    },
    dropdownContainer: {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        paddingVertical: 5,
        width: 150, // Adjust width as needed
        // Remove alignSelf, marginRight, marginTop as we are using absolute positioning
        // alignSelf: 'flex-end',
        // marginRight: 20, 
        // marginTop: 180, 
        elevation: 5, // Add elevation for Android shadow
        shadowColor: '#000', // Shadow for iOS
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