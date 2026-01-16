/**
 * Schedule filter types
 * Used to filter training sessions by program, level, and age group
 */

export type FilterProgramType = 'all' | 'taekwondo' | 'zumba' | 'deepwork';

export interface ScheduleFilters {
  programType: FilterProgramType;
  searchText: string;
}

export const FILTER_STORAGE_KEY = 'schedule-filters';

export const DEFAULT_FILTERS: ScheduleFilters = {
  programType: 'all',
  searchText: '',
};

export const PROGRAM_TYPE_OPTIONS: Array<{ value: FilterProgramType; labelKey: string }> = [
  { value: 'all', labelKey: 'schedule.filters.all' },
  { value: 'taekwondo', labelKey: 'schedule.filters.taekwondo' },
  { value: 'zumba', labelKey: 'schedule.filters.zumba' },
  { value: 'deepwork', labelKey: 'schedule.filters.deepwork' },
];
