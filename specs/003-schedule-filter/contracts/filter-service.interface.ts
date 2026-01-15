/**
 * Filter Service Contract
 * Feature: 003-schedule-filter
 * 
 * Manages training schedule filter state with persistence.
 * Provides centralized filter control and change notifications.
 */

import { Observable } from 'rxjs';

/**
 * Selected filter values (e.g., ["beginner", "kids"])
 */
export type FilterCriteria = string[];

/**
 * Training session with filter attributes
 */
export interface TrainingSession {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor?: string;
  level: string;          // "beginner", "intermediate", "advanced", "expert", "all"
  ageGroup: string;       // "kids", "teens", "adults", "seniors", "all"
  levelAgeKey: string;    // "{level}_{ageGroup}" for efficient filtering
}

/**
 * Filter option displayed in UI with count
 */
export interface LevelAgeOption {
  label: string;    // Translated display text (e.g., "Anfänger")
  value: string;    // Internal key (e.g., "beginner")
  count: number;    // Number of matching sessions
}

/**
 * Filter service interface for managing schedule filters
 * 
 * @example
 * ```typescript
 * constructor(private filterService: IFilterService) {
 *   this.filterService.initializeFilters();
 *   
 *   this.filterService.filtersChanged$
 *     .pipe(takeUntilDestroyed())
 *     .subscribe(filters => {
 *       this.applyFilters(filters);
 *     });
 * }
 * ```
 */
export interface IFilterService {
  /**
   * Observable that emits whenever filters change
   * 
   * @returns Observable stream of selected filter criteria
   * 
   * @example
   * ```typescript
   * this.filterService.filtersChanged$
   *   .subscribe(filters => {
   *     console.log('Active filters:', filters);
   *     this.filteredSessions = this.applyFilters(this.allSessions, filters);
   *   });
   * ```
   */
  readonly filtersChanged$: Observable<FilterCriteria>;
  
  /**
   * Get current selected filters
   * 
   * @returns Array of selected filter keys
   * 
   * @example
   * ```typescript
   * const filters = this.filterService.getSelectedFilters();
   * // Returns: ["beginner", "kids"]
   * ```
   */
  getSelectedFilters(): FilterCriteria;
  
  /**
   * Set filters to specific values (replaces all)
   * Applies filters and persists to localStorage
   * 
   * @param filters - Filter keys to apply
   * @returns true if successfully saved, false on error
   * 
   * @example
   * ```typescript
   * const success = this.filterService.setFilters(['beginner', 'intermediate']);
   * if (success) {
   *   console.log('Filters applied');
   * }
   * ```
   */
  setFilters(filters: FilterCriteria): boolean;
  
  /**
   * Add a single filter to current selection
   * 
   * @param filterValue - Filter key to add (e.g., "beginner")
   * @returns true if successfully added and saved
   * 
   * @example
   * ```typescript
   * // User checks "Anfänger" checkbox
   * this.filterService.addFilter('beginner');
   * ```
   */
  addFilter(filterValue: string): boolean;
  
  /**
   * Remove a single filter from current selection
   * 
   * @param filterValue - Filter key to remove
   * @returns true if successfully removed and saved
   * 
   * @example
   * ```typescript
   * // User unchecks "Anfänger" checkbox
   * this.filterService.removeFilter('beginner');
   * ```
   */
  removeFilter(filterValue: string): boolean;
  
  /**
   * Clear all filters (show all sessions)
   * 
   * @returns true if successfully cleared and saved
   * 
   * @example
   * ```typescript
   * // User clicks "Clear all" button
   * this.filterService.clearFilters();
   * ```
   */
  clearFilters(): boolean;
  
  /**
   * Check if a specific filter is currently selected
   * 
   * @param filterValue - Filter key to check
   * @returns true if filter is active
   * 
   * @example
   * ```typescript
   * const isBeginnerSelected = this.filterService.isFilterSelected('beginner');
   * // Use for checkbox checked state
   * ```
   */
  isFilterSelected(filterValue: string): boolean;
  
  /**
   * Get count of active filters
   * 
   * @returns Number of selected filters
   * 
   * @example
   * ```typescript
   * const count = this.filterService.getFilterCount();
   * // Display badge: "Filters (3)"
   * ```
   */
  getFilterCount(): number;
  
  /**
   * Initialize filters from storage or default
   * Should be called once during component initialization
   * 
   * Reads localStorage, validates values, emits initial state.
   * Falls back to empty filters if no valid state found.
   * 
   * @returns The initialized filter criteria
   * 
   * @example
   * ```typescript
   * // In ScheduleComponent ngOnInit
   * ngOnInit() {
   *   const initialFilters = this.filterService.initializeFilters();
   *   this.applyFiltersToView(initialFilters);
   * }
   * ```
   */
  initializeFilters(): FilterCriteria;
  
  /**
   * Apply filters to sessions (OR logic)
   * Filters sessions where level OR ageGroup matches any selected filter
   * 
   * @param sessions - All training sessions
   * @param filters - Filter criteria (optional, uses current if not provided)
   * @returns Filtered sessions
   * 
   * @example
   * ```typescript
   * // Without explicit filters (uses current)
   * const filtered = this.filterService.applyFilters(this.allSessions);
   * 
   * // With explicit filters
   * const filtered = this.filterService.applyFilters(
   *   this.allSessions, 
   *   ['beginner', 'kids']
   * );
   * ```
   */
  applyFilters(sessions: TrainingSession[], filters?: FilterCriteria): TrainingSession[];
  
  /**
   * Generate filter options from sessions with counts
   * Extracts unique levels or age groups and counts occurrences
   * 
   * @param sessions - All training sessions
   * @param category - Filter category ('level' or 'ageGroup')
   * @returns Sorted options with counts
   * 
   * @example
   * ```typescript
   * const levelOptions = this.filterService.generateOptions(sessions, 'level');
   * // Returns: [
   * //   { label: 'Anfänger', value: 'beginner', count: 12 },
   * //   { label: 'Fortgeschrittene', value: 'advanced', count: 8 }
   * // ]
   * 
   * const ageOptions = this.filterService.generateOptions(sessions, 'ageGroup');
   * ```
   */
  generateOptions(
    sessions: TrainingSession[], 
    category: 'level' | 'ageGroup'
  ): LevelAgeOption[];
}

/**
 * Filter service implementation notes:
 * 
 * 1. **Singleton**: Provided in 'root' to ensure single instance
 * 2. **Persistence**: Uses localStorage with versioned JSON
 * 3. **Performance**: <100ms filter response for ~50 sessions
 * 4. **Logic**: OR within category (ANY match shows session)
 * 5. **Immediate Persistence**: Save on every filter change
 * 6. **Error Handling**: All storage operations wrapped in try-catch
 * 7. **Set Optimization**: Use Set for O(1) filter lookups
 * 
 * @see data-model.md for storage format and validation rules
 * @see research.md for implementation patterns and alternatives
 */

/**
 * Example implementation skeleton:
 * 
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class FilterService implements IFilterService {
 *   private readonly STORAGE_KEY = 'schedule-filter-state';
 *   private readonly STATE_VERSION = 1;
 *   
 *   private filtersSubject = new BehaviorSubject<FilterCriteria>([]);
 *   public readonly filtersChanged$ = this.filtersSubject.asObservable();
 *   
 *   getSelectedFilters(): FilterCriteria {
 *     return this.filtersSubject.value;
 *   }
 *   
 *   setFilters(filters: FilterCriteria): boolean {
 *     if (!this.validateFilters(filters)) return false;
 *     
 *     const saved = this.saveState({
 *       version: this.STATE_VERSION,
 *       selectedFilters: filters,
 *       isPanelExpanded: false
 *     });
 *     
 *     if (saved) {
 *       this.filtersSubject.next(filters);
 *     }
 *     
 *     return saved;
 *   }
 *   
 *   addFilter(filterValue: string): boolean {
 *     const current = this.getSelectedFilters();
 *     if (current.includes(filterValue)) return true;
 *     
 *     return this.setFilters([...current, filterValue]);
 *   }
 *   
 *   removeFilter(filterValue: string): boolean {
 *     const current = this.getSelectedFilters();
 *     const updated = current.filter(f => f !== filterValue);
 *     return this.setFilters(updated);
 *   }
 *   
 *   clearFilters(): boolean {
 *     return this.setFilters([]);
 *   }
 *   
 *   isFilterSelected(filterValue: string): boolean {
 *     return this.getSelectedFilters().includes(filterValue);
 *   }
 *   
 *   getFilterCount(): number {
 *     return this.getSelectedFilters().length;
 *   }
 *   
 *   initializeFilters(): FilterCriteria {
 *     const state = this.loadState();
 *     this.filtersSubject.next(state.selectedFilters);
 *     return state.selectedFilters;
 *   }
 *   
 *   applyFilters(sessions: TrainingSession[], filters?: FilterCriteria): TrainingSession[] {
 *     const activeFilters = filters ?? this.getSelectedFilters();
 *     
 *     if (activeFilters.length === 0) {
 *       return sessions;
 *     }
 *     
 *     const filterSet = new Set(activeFilters);
 *     
 *     return sessions.filter(session => 
 *       filterSet.has(session.level) || filterSet.has(session.ageGroup)
 *     );
 *   }
 *   
 *   generateOptions(sessions: TrainingSession[], category: 'level' | 'ageGroup'): LevelAgeOption[] {
 *     const counts = new Map<string, number>();
 *     
 *     for (const session of sessions) {
 *       const value = category === 'level' ? session.level : session.ageGroup;
 *       counts.set(value, (counts.get(value) || 0) + 1);
 *     }
 *     
 *     const options: LevelAgeOption[] = [];
 *     for (const [value, count] of counts) {
 *       options.push({
 *         label: this.translateKey(`filter.${category}.${value}`),
 *         value,
 *         count
 *       });
 *     }
 *     
 *     options.sort((a, b) => a.label.localeCompare(b.label, 'de-DE'));
 *     return options;
 *   }
 *   
 *   private loadState(): FilterState {
 *     try {
 *       const stored = localStorage.getItem(this.STORAGE_KEY);
 *       if (!stored) return this.getDefaultState();
 *       
 *       const parsed = JSON.parse(stored);
 *       return this.validateState(parsed);
 *     } catch {
 *       return this.getDefaultState();
 *     }
 *   }
 *   
 *   private saveState(state: FilterState): boolean {
 *     try {
 *       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
 *       return true;
 *     } catch {
 *       return false;
 *     }
 *   }
 *   
 *   private validateFilters(filters: unknown): filters is FilterCriteria {
 *     return Array.isArray(filters) && filters.every(f => typeof f === 'string');
 *   }
 *   
 *   private getDefaultState(): FilterState {
 *     return {
 *       version: this.STATE_VERSION,
 *       selectedFilters: [],
 *       isPanelExpanded: false
 *     };
 *   }
 * }
 * ```
 */
