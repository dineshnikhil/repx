import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
	duration: number;
	totalVolume: number;
	totalSets: number;
	formatDuration: (totalSeconds: number) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
	duration,
	totalVolume,
	totalSets,
	formatDuration,
}) => {
	return (
		<View style={styles.statsCard}>
			<View style={styles.statItem}>
				<Text style={styles.statLabel}>Duration</Text>
				<Text style={styles.statValueHighlighted}>
					{formatDuration(duration)}
				</Text>
			</View>
			<View style={styles.statItem}>
				<Text style={styles.statLabel}>Volume</Text>
				<Text style={styles.statValue}>{totalVolume} kg</Text>
			</View>
			<View style={styles.statItem}>
				<Text style={styles.statLabel}>Sets</Text>
				<Text style={styles.statValue}>{totalSets}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	statsCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 32,
	},
	statItem: {
		alignItems: 'center',
	},
	statLabel: {
		color: '#999',
		fontSize: 16,
		marginBottom: 8,
	},
	statValue: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	statValueHighlighted: {
		color: '#FF5722',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
