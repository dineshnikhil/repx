export interface ExerciseSet {
	id: string;
	previous: string;
	kg: string;
	reps: string;
	completed: boolean;
}

export interface WorkoutExercise {
	name: string;
	muscle: string;
	sets: ExerciseSet[];
	comment?: string;
}

export interface BaseExercise {
	name: string;
	muscle: string;
}
