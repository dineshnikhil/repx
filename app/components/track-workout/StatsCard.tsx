import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
	duration: number;
	totalVolume: number;
	totalSets: number;
	formatDuration: (seconds: number) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
	duration,
	totalVolume,
	totalSets,
	formatDuration,
}) => {
	return (
		<View style={styles.statsCard}>
			<View style={styles.statColumn}>
				<Text style={styles.statTitle}>Duration</Text>
				<Text style={styles.statValue}>{formatDuration(duration)}</Text>
			</View>
			<View style={styles.statDivider} />
			<View style={styles.statColumn}>
				<Text style={styles.statTitle}>Volume</Text>
				<Text style={styles.statValue}>
					{totalVolume.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
					<Text style={styles.statUnit}>kg</Text>
				</Text>
			</View>
			<View style={styles.statDivider} />
			<View style={styles.statColumn}>
				<Text style={styles.statTitle}>Sets</Text>
				<Text style={styles.statValue}>{totalSets}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	statsCard: {
		backgroundColor: '#1C1C1E',
		borderRadius: 16,
		flexDirection: 'row',
		padding: 16,
		marginTop: 16,
		marginBottom: 20,
	},
	statColumn: {
		flex: 1,
		alignItems: 'center',
	},
	statDivider: {
		width: 1,
		backgroundColor: '#2C2C2E',
		marginHorizontal: 10,
	},
	statTitle: {
		color: '#8A8A8E',
		fontSize: 14,
		marginBottom: 4,
	},
	statValue: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	statUnit: {
		fontSize: 12,
		color: '#8A8A8E',
	},
});
