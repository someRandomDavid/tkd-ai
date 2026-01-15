/**
 * Trainer Service Contract
 * Feature: 004-trainers-directory
 * 
 * Manages trainer data loading, sorting, and filtering.
 * Provides centralized access to trainer information.
 */

import { Observable } from 'rxjs';

/**
 * Trainer profile
 */
export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  programs: string[];              // e.g., ["kids", "adults", "competition"]
  specialRoles?: string[];         // e.g., ["head-instructor"]
  email?: string;
  phone?: string;
  bio?: string;
  certifications?: string[];       // e.g., ["dan-5", "instructor-license"]
  sortKey?: string;                // Pre-computed German sort key
}

/**
 * Trainer service interface for managing trainer data
 * 
 * @example
 * ```typescript
 * constructor(private trainerService: ITrainerService) {
 *   this.trainerService.loadTrainers().subscribe(trainers => {
 *     this.trainers = trainers;
 *   });
 * }
 * ```
 */
export interface ITrainerService {
  /**
   * Observable of trainer data
   * Emits when trainers are loaded or updated
   * 
   * @returns Observable stream of trainer arrays
   * 
   * @example
   * ```typescript
   * this.trainerService.trainers$
   *   .pipe(takeUntilDestroyed())
   *   .subscribe(trainers => {
   *     this.displayTrainers = trainers;
   *   });
   * ```
   */
  readonly trainers$: Observable<Trainer[]>;
  
  /**
   * Load trainers from JSON file
   * Fetches, validates, sorts alphabetically by last name (German locale)
   * 
   * @returns Observable of sorted trainers
   * 
   * @example
   * ```typescript
   * ngOnInit() {
   *   this.trainerService.loadTrainers()
   *     .subscribe({
   *       next: (trainers) => {
   *         console.log(`Loaded ${trainers.length} trainers`);
   *         this.trainers = trainers;
   *       },
   *       error: (error) => {
   *         console.error('Failed to load trainers:', error);
   *         this.showErrorMessage();
   *       }
   *     });
   * }
   * ```
   */
  loadTrainers(): Observable<Trainer[]>;
  
  /**
   * Get all trainers (synchronous)
   * Returns cached trainers or empty array if not yet loaded
   * 
   * @returns Array of trainers
   * 
   * @example
   * ```typescript
   * const trainers = this.trainerService.getTrainers();
   * if (trainers.length === 0) {
   *   this.trainerService.loadTrainers().subscribe();
   * }
   * ```
   */
  getTrainers(): Trainer[];
  
  /**
   * Get trainer by ID
   * 
   * @param id - Trainer ID (kebab-case, e.g., "hans-mueller")
   * @returns Trainer or undefined if not found
   * 
   * @example
   * ```typescript
   * const trainer = this.trainerService.getTrainerById('hans-mueller');
   * if (trainer) {
   *   console.log(`Found: ${trainer.firstName} ${trainer.lastName}`);
   * }
   * ```
   */
  getTrainerById(id: string): Trainer | undefined;
  
  /**
   * Get trainers by program
   * Returns trainers who teach the specified program
   * 
   * @param program - Program key (e.g., "kids", "competition")
   * @returns Array of trainers teaching this program
   * 
   * @example
   * ```typescript
   * const kidsTrainers = this.trainerService.getTrainersByProgram('kids');
   * console.log(`${kidsTrainers.length} trainers teach kids classes`);
   * ```
   */
  getTrainersByProgram(program: string): Trainer[];
  
  /**
   * Get trainers by special role
   * Returns trainers with the specified role
   * 
   * @param role - Role key (e.g., "head-instructor", "competition-coach")
   * @returns Array of trainers with this role
   * 
   * @example
   * ```typescript
   * const headTrainers = this.trainerService.getTrainersByRole('head-instructor');
   * ```
   */
  getTrainersByRole(role: string): Trainer[];
  
  /**
   * Sort trainers alphabetically by last name (German locale)
   * Handles umlauts correctly (ä, ö, ü)
   * 
   * @param trainers - Array of trainers to sort
   * @returns Sorted array (does not mutate original)
   * 
   * @example
   * ```typescript
   * const sorted = this.trainerService.sortTrainersAlphabetically(trainers);
   * // Müller comes before Schmidt
   * ```
   */
  sortTrainersAlphabetically(trainers: Trainer[]): Trainer[];
  
  /**
   * Generate initials from trainer name
   * Used for placeholder when photo is missing
   * 
   * @param trainer - Trainer object
   * @returns Initials (e.g., "HM" for Hans Müller)
   * 
   * @example
   * ```typescript
   * const initials = this.trainerService.getTrainerInitials(trainer);
   * // Display in placeholder: <div>{{ initials }}</div>
   * ```
   */
  getTrainerInitials(trainer: Trainer): string;
  
  /**
   * Generate placeholder gradient for trainer
   * Deterministic - same trainer always gets same gradient
   * Used when photo is missing or fails to load
   * 
   * @param trainer - Trainer object
   * @returns CSS linear-gradient string
   * 
   * @example
   * ```typescript
   * const gradient = this.trainerService.getTrainerGradient(trainer);
   * // Apply: <div [style.background]="gradient">{{ initials }}</div>
   * ```
   */
  getTrainerGradient(trainer: Trainer): string;
  
  /**
   * Check if trainer has specific program
   * 
   * @param trainer - Trainer object
   * @param program - Program key
   * @returns true if trainer teaches this program
   * 
   * @example
   * ```typescript
   * if (this.trainerService.hasProgram(trainer, 'competition')) {
   *   // Show competition badge
   * }
   * ```
   */
  hasProgram(trainer: Trainer, program: string): boolean;
  
  /**
   * Check if trainer has specific role
   * 
   * @param trainer - Trainer object
   * @param role - Role key
   * @returns true if trainer has this role
   * 
   * @example
   * ```typescript
   * if (this.trainerService.hasRole(trainer, 'head-instructor')) {
   *   // Highlight as head instructor
   * }
   * ```
   */
  hasRole(trainer: Trainer, role: string): boolean;
  
  /**
   * Get loading strategy for trainer photo
   * First N trainers load eagerly (above fold), rest lazy
   * 
   * @param index - Trainer index in sorted array
   * @returns 'eager' or 'lazy'
   * 
   * @example
   * ```typescript
   * // In template:
   * <img [loading]="trainerService.getLoadingStrategy(i)" />
   * ```
   */
  getLoadingStrategy(index: number): 'eager' | 'lazy';
}

/**
 * Trainer service implementation notes:
 * 
 * 1. **Singleton**: Provided in 'root' to ensure single instance
 * 2. **Data Source**: Static JSON file at assets/data/trainers.json
 * 3. **Sorting**: German locale with localeCompare('de-DE')
 * 4. **Caching**: Load once, cache in memory (read-only data)
 * 5. **Performance**: <10ms sorting for ~20 trainers
 * 6. **Lazy Loading**: First 6 trainers eager, rest lazy (80% bandwidth savings)
 * 7. **Error Handling**: Validate data, fallback to empty array on error
 * 
 * @see data-model.md for data structures and validation rules
 * @see research.md for implementation patterns and alternatives
 */

/**
 * Example implementation skeleton:
 * 
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class TrainerService implements ITrainerService {
 *   private readonly TRAINERS_JSON_PATH = 'assets/data/trainers.json';
 *   private readonly EAGER_LOAD_COUNT = 6;
 *   
 *   private trainersSubject = new BehaviorSubject<Trainer[]>([]);
 *   public readonly trainers$ = this.trainersSubject.asObservable();
 *   
 *   constructor(private http: HttpClient) {}
 *   
 *   loadTrainers(): Observable<Trainer[]> {
 *     return this.http.get<TrainersData>(this.TRAINERS_JSON_PATH).pipe(
 *       map(data => this.validateTrainersData(data)),
 *       map(data => this.sortTrainersAlphabetically(data.trainers)),
 *       tap(trainers => this.trainersSubject.next(trainers)),
 *       catchError(error => {
 *         console.error('Failed to load trainers:', error);
 *         return of([]);
 *       })
 *     );
 *   }
 *   
 *   getTrainers(): Trainer[] {
 *     return this.trainersSubject.value;
 *   }
 *   
 *   getTrainerById(id: string): Trainer | undefined {
 *     return this.getTrainers().find(t => t.id === id);
 *   }
 *   
 *   getTrainersByProgram(program: string): Trainer[] {
 *     return this.getTrainers().filter(t => t.programs.includes(program));
 *   }
 *   
 *   getTrainersByRole(role: string): Trainer[] {
 *     return this.getTrainers().filter(t => 
 *       t.specialRoles?.includes(role) ?? false
 *     );
 *   }
 *   
 *   sortTrainersAlphabetically(trainers: Trainer[]): Trainer[] {
 *     return [...trainers].sort((a, b) => 
 *       a.lastName.localeCompare(b.lastName, 'de-DE')
 *     );
 *   }
 *   
 *   getTrainerInitials(trainer: Trainer): string {
 *     const first = trainer.firstName.charAt(0).toUpperCase();
 *     const last = trainer.lastName.charAt(0).toUpperCase();
 *     return `${first}${last}`;
 *   }
 *   
 *   getTrainerGradient(trainer: Trainer): string {
 *     const name = `${trainer.firstName} ${trainer.lastName}`;
 *     const hash = name.split('').reduce((acc, char) => 
 *       acc + char.charCodeAt(0), 0
 *     );
 *     const hue = hash % 360;
 *     return `linear-gradient(135deg, hsl(${hue}, 50%, 45%), hsl(${hue + 40}, 50%, 55%))`;
 *   }
 *   
 *   hasProgram(trainer: Trainer, program: string): boolean {
 *     return trainer.programs.includes(program);
 *   }
 *   
 *   hasRole(trainer: Trainer, role: string): boolean {
 *     return trainer.specialRoles?.includes(role) ?? false;
 *   }
 *   
 *   getLoadingStrategy(index: number): 'eager' | 'lazy' {
 *     return index < this.EAGER_LOAD_COUNT ? 'eager' : 'lazy';
 *   }
 *   
 *   private validateTrainersData(data: unknown): TrainersData {
 *     // Validation logic from data-model.md
 *     // ...
 *   }
 * }
 * ```
 */
