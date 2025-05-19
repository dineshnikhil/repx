import React, { createContext, ReactNode, useContext, useState } from 'react';

/**
 * Interface for the workout status context
 */
interface WorkoutStatusContextType {
	isWorkoutInProgress: boolean;
	setIsWorkoutInProgress: (status: boolean) => void;
	workoutNameToResume: string | null;
	setWorkoutNameToResume: (name: string | null) => void;
}

/**
 * Context for tracking workout status across the application
 */
const WorkoutStatusContext = createContext<
	WorkoutStatusContextType | undefined
>(undefined);

/**
 * Provider component for workout status
 */
export const WorkoutStatusProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);
	const [workoutNameToResume, setWorkoutNameToResume] = useState<string | null>(
		null
	);

	return (
		<WorkoutStatusContext.Provider
			value={{
				isWorkoutInProgress,
				setIsWorkoutInProgress,
				workoutNameToResume,
				setWorkoutNameToResume,
			}}
		>
			{children}
		</WorkoutStatusContext.Provider>
	);
};

/**
 * Hook to access workout status context
 */
export const useWorkoutStatus = () => {
	const context = useContext(WorkoutStatusContext);
	if (!context) {
		throw new Error(
			'useWorkoutStatus must be used within a WorkoutStatusProvider'
		);
	}
	return context;
};
