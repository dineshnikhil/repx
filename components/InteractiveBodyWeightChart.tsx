import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CurveType, LineChart } from 'react-native-gifted-charts';

const timeRangeOptions = [
    { label: 'Week', value: 'week', days: 7 },
    { label: 'Month', value: 'month', days: 30 },
    { label: '3 Months', value: '3months', days: 90 },
    { label: '6 Months', value: '6months', days: 180 },
];

interface WeightDataPoint {
    value: number;
    label?: string; // For x-axis labels
    date?: string; // Original date, useful for tooltips
    dataPointText?: string; // Text to show on data point
}

interface InteractiveBodyWeightChartProps {
    selectedRange: string;
}

const InteractiveBodyWeightChart: React.FC<InteractiveBodyWeightChartProps> = ({ selectedRange }) => {
    const [chartData, setChartData] = useState<WeightDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [yAxisLabels, setYAxisLabels] = useState<string[]>([]);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100); // Default max

    useEffect(() => {
        const generateDataForRange = () => {
            setIsLoading(true);
            const numDays = timeRangeOptions.find(opt => opt.value === selectedRange)?.days || 7;
            const data: WeightDataPoint[] = [];
            const today = new Date();
            let tempMinWeight = Infinity;
            let tempMaxWeight = -Infinity;

            for (let i = numDays - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const baseWeight = 78;
                // Create more pronounced fluctuations for a more curved appearance
                // Use a combination of sine waves with different frequencies for a more natural curve
                // More dramatic fluctuations to match the homepage image
                // Create more visible fluctuations with higher amplitude
                const fluctuation = Math.sin(i * 0.8) * 2.5 + Math.cos(i * 0.3) * 2 + (Math.random() - 0.5) * 0.8;
                const weight = baseWeight + fluctuation;
                const roundedWeight = parseFloat(weight.toFixed(2));

                if (roundedWeight < tempMinWeight) tempMinWeight = roundedWeight;
                if (roundedWeight > tempMaxWeight) tempMaxWeight = roundedWeight;
                
                let label = '';
                if (numDays <= 7) { 
                    label = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
                } else if (numDays <= 30 && i % 7 === 0) { 
                    label = `${date.getMonth() + 1}/${date.getDate()}`;
                } else if (numDays > 30 && i % (Math.floor(numDays / 5)) === 0) { 
                     label = `${date.getMonth() + 1}/${date.getDate()}`;
                }

                data.push({
                    value: roundedWeight,
                    label: label, 
                    date: date.toISOString().split('T')[0],
                });
            }
            
            if (data.length > 0 && !data[data.length-1].label && numDays > 7) {
                const lastDate = new Date(data[data.length-1].date!)
                data[data.length-1].label = `${lastDate.getMonth() + 1}/${lastDate.getDate()}`;
            }
            setChartData(data);

            const dataMin = data.length > 0 ? tempMinWeight : 70;
            const dataMax = data.length > 0 ? tempMaxWeight : 80;
            
            const range = dataMax - dataMin;
            // Ensure a minimum range if all data points are the same or very close
            const minRange = 2; // e.g., ensure at least a 2kg range for y-axis
            const effectiveRange = Math.max(range, minRange);

            // Use a much smaller buffer to make the y-axis range tighter around the data
            // This will make weight fluctuations appear more significant
            const buffer = Math.max(effectiveRange * 0.05, 0.2); // 5% buffer or at least 0.2
            
            // Narrow the y-axis range to make fluctuations more visible
            let calculatedMinValue = Math.floor((dataMin - buffer) * 2) / 2; // Round down to nearest 0.5
            let calculatedMaxValue = Math.ceil((dataMax + buffer) * 2) / 2;   // Round up to nearest 0.5
            
            // Dramatically constrain the range to make the chart more interesting
            // Use a very tight range to make even small fluctuations appear significant
            const midPoint = (calculatedMaxValue + calculatedMinValue) / 2;
            // Use a very small range of just 2-3 kg to make fluctuations obvious
            calculatedMinValue = midPoint - 1.2;
            calculatedMaxValue = midPoint + 1.2;

            // Ensure minValue is not greater than maxValue after adjustments
            if (calculatedMinValue >= calculatedMaxValue) {
                calculatedMaxValue = calculatedMinValue + minRange; 
            }

            setMinValue(calculatedMinValue);
            setMaxValue(calculatedMaxValue);

            const numSections = 4;
            const step = (calculatedMaxValue - calculatedMinValue) / numSections;
            const labels = [];
            if (step > 0) { // Ensure step is positive
                for (let i = 0; i <= numSections; i++) {
                    // Labels should correspond to the values on the axis from bottom to top
                    labels.push((calculatedMinValue + i * step).toFixed(1));
                }
                // The library expects labels from top to bottom, so we reverse the generated labels
                setYAxisLabels(labels.slice().reverse()); 
            } else {
                // Handle case with no range or single point
                setYAxisLabels([calculatedMaxValue.toFixed(1), calculatedMinValue.toFixed(1)]);
            }
            
            // Store the stepValue for LineChart
            const stepValue = step;
            
            setIsLoading(false);
        };
        generateDataForRange();
    }, [selectedRange]);

    if (isLoading) {
        return <Text style={styles.loadingText}>Loading graph data...</Text>;
    }

    if (chartData.length === 0) {
        return <Text style={styles.loadingText}>No data available for this range.</Text>;
    }

    const screenWidth = Dimensions.get('window').width;
    // Adjust width to account for container padding to match the homepage image exactly
    const chartWidth = screenWidth - 100; // Reduced padding to make chart appear more to the left
    const endPadding = 60; // Increased end padding to compensate for moving left

    return (
        <View style={styles.chartContainer}>
            <LineChart
                data={chartData}
                width={chartWidth}
                height={100} // Reduce height to match the homepage image
                initialSpacing={16} // Initial spacing
                spacing={chartData.length > 1 ? (chartWidth - 32 - endPadding) / (chartData.length -1) : chartWidth - 32 - endPadding} // Account for end padding
                textColor="#8E8E93"
                textFontSize={10}
                color="#FF6B00"
                thickness={2.5}
                curved={true}
                curvature={0.5}
                // Use type assertion to fix TypeScript error
                curveType={'natural' as unknown as CurveType}
                yAxisColor="transparent"
                xAxisColor="#3A3A3C"
                rulesType="solid"
                rulesColor="#3A3A3C"
                rulesLength={chartWidth - endPadding} // Adjusted rules length to account for end padding
                yAxisTextStyle={{ color: '#8E8E93', fontSize: 10, marginRight: 5 }}
                xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 10, paddingTop: 5 }}
                noOfSections={3} // Reduce the number of sections to make fluctuations more visible
                maxValue={maxValue} // This should be the numerically largest value (top of the graph)
                stepValue={(maxValue - minValue) / 3} // Calculate the step value to match noOfSections
                yAxisOffset={minValue} // Set the starting value of Y-axis
                yAxisLabelTexts={yAxisLabels} // Ensure this is ordered top-to-bottom
                yAxisLabelWidth={35} 

                // invertYAxis // This prop might be useful if the library has it and behavior is inverted
                
                hideDataPoints
                focusEnabled 
                showStripOnFocus
                stripHeight={110} // Match the chart height
                stripWidth={1}
                stripColor="rgba(255, 107, 0, 0.3)"
                // showTextOnFocus // We use pointerLabelComponent for custom tooltip
                focusedDataPointShape="circle"
                focusedDataPointWidth={6}
                focusedDataPointColor="#FF6B00" // Orange color for focused point
                focusedDataPointRadius={3}
                pointerConfig={{
                    pointerStripHeight: 110, // Aligned with chart height
                    pointerStripColor: 'rgba(255, 107, 0, 0.2)',
                    pointerStripWidth: 1,
                    pointerColor: '#FF6B00',
                    radius: 4,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 50, // Adjusted height for tooltip
                    activatePointersOnLongPress: false, // Activate on tap
                    activatePointersDelay: 0, // Add comma here
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items: any[]) => {
                        if (!items || items.length === 0) return null;
                        const item = items[0];
                        return (
                            <View style={styles.tooltipContainer}>
                                <Text style={styles.tooltipValue}>{item.value.toFixed(2)} kg</Text>
                                <Text style={styles.tooltipDate}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                            </View>
                        );
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        marginVertical: 10, // Reduced vertical margin
        paddingLeft: 5, // Left padding reduced to move chart left
        paddingRight: 60, // Right padding increased to balance
        alignItems: 'flex-start', // Align to the start (left) instead of center
        justifyContent: 'center', // Center vertically
        width: '100%', // Take up full width of parent container
        overflow: 'hidden', // Hide anything that might overflow
        // Use a percentage instead of screenWidth to avoid scope issues
        maxWidth: '100%',
    },
    loadingText: {
        color: '#8E8E93',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
    },
    tooltipContainer: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#2C2C2E', // Darker tooltip background
        borderRadius: 6,
        // borderColor: '#FF6B00', // Optional: border for tooltip
        // borderWidth: 1,
        alignItems: 'center',
    },
    tooltipDate: {
        color: '#AEAEB2', // Lighter grey for date
        fontSize: 10,
    },
    tooltipValue: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
});

export default InteractiveBodyWeightChart;