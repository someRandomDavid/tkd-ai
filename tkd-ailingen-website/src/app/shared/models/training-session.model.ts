/**
 * Training session model
 * Represents individual training sessions for each program
 */

export type ProgramType = 'taekwondo' | 'zumba' | 'deepwork';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface TrainingSession {
  id: string;
  programType: ProgramType;
  dayOfWeek: DayOfWeek;
  startTime: string; // Format: "HH:mm" (24-hour)
  endTime: string; // Format: "HH:mm" (24-hour)
  location: string;
  instructor?: string;
  levelAgeGroup: string;
  maxParticipants?: number;
  notes?: string;
}

export interface TrainingSchedule {
  lastUpdated: string; // ISO 8601 date
  sessions: TrainingSession[];
}
