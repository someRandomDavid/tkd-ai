/**
 * Theme Service Contract
 * Feature: 002-theme-toggle
 * 
 * Manages application-wide theme state (dark/light mode) with persistence.
 * Singleton service provides centralized theme control and change notifications.
 */

import { Observable } from 'rxjs';

/**
 * Theme preference type
 */
export type ThemePreference = 'dark' | 'light';

/**
 * Theme service interface for managing application theme
 * 
 * @example
 * ```typescript
 * constructor(private themeService: IThemeService) {
 *   this.themeService.initializeTheme();
 *   this.themeService.themeChanged$.subscribe(theme => {
 *     console.log('Theme changed to:', theme);
 *   });
 * }
 * ```
 */
export interface IThemeService {
  /**
   * Observable that emits whenever theme changes
   * 
   * @returns Observable stream of theme preferences
   * 
   * @example
   * ```typescript
   * this.themeService.themeChanged$
   *   .pipe(takeUntilDestroyed())
   *   .subscribe(theme => {
   *     this.currentTheme = theme;
   *     this.updateStyles();
   *   });
   * ```
   */
  readonly themeChanged$: Observable<ThemePreference>;
  
  /**
   * Get current active theme
   * 
   * @returns Current theme preference ('dark' or 'light')
   * 
   * @example
   * ```typescript
   * const theme = this.themeService.getCurrentTheme();
   * if (theme === 'dark') {
   *   // Apply dark-specific styling
   * }
   * ```
   */
  getCurrentTheme(): ThemePreference;
  
  /**
   * Set theme to specific value
   * Applies theme to DOM and persists to localStorage
   * 
   * @param theme - Theme preference to apply
   * @returns true if successfully applied and saved, false on error
   * 
   * @example
   * ```typescript
   * const success = this.themeService.setTheme('light');
   * if (!success) {
   *   console.error('Failed to apply theme');
   * }
   * ```
   */
  setTheme(theme: ThemePreference): boolean;
  
  /**
   * Toggle between dark and light themes
   * Convenience method for switching themes
   * 
   * @returns The new theme after toggling
   * 
   * @example
   * ```typescript
   * // If currently 'dark', switches to 'light' and returns 'light'
   * const newTheme = this.themeService.toggleTheme();
   * ```
   */
  toggleTheme(): ThemePreference;
  
  /**
   * Initialize theme from storage or default
   * Should be called once during app initialization (AppComponent)
   * 
   * Reads localStorage, validates value, applies to DOM.
   * Falls back to default 'dark' if no valid preference found.
   * 
   * @returns The initialized theme
   * 
   * @example
   * ```typescript
   * // In AppComponent constructor or ngOnInit
   * ngOnInit() {
   *   const initialTheme = this.themeService.initializeTheme();
   *   console.log('App started with theme:', initialTheme);
   * }
   * ```
   */
  initializeTheme(): ThemePreference;
}

/**
 * Theme service implementation notes:
 * 
 * 1. **Singleton**: Provided in 'root' to ensure single instance
 * 2. **Persistence**: Uses localStorage with sessionStorage fallback
 * 3. **DOM Manipulation**: Adds/removes 'light-theme' class on body
 * 4. **Performance**: Theme application should be <10ms
 * 5. **Flash Prevention**: Inline script in index.html initializes before Angular
 * 6. **Error Handling**: All storage operations wrapped in try-catch
 * 
 * @see data-model.md for storage format and validation rules
 * @see research.md for implementation patterns and alternatives
 */

/**
 * Example implementation skeleton:
 * 
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ThemeService implements IThemeService {
 *   private readonly STORAGE_KEY = 'theme-preference';
 *   private readonly DEFAULT_THEME: ThemePreference = 'dark';
 *   private readonly LIGHT_THEME_CLASS = 'light-theme';
 *   
 *   private themeSubject = new BehaviorSubject<ThemePreference>(this.DEFAULT_THEME);
 *   public readonly themeChanged$ = this.themeSubject.asObservable();
 *   
 *   getCurrentTheme(): ThemePreference {
 *     return this.themeSubject.value;
 *   }
 *   
 *   setTheme(theme: ThemePreference): boolean {
 *     if (!this.isValidTheme(theme)) return false;
 *     
 *     this.applyThemeToDOM(theme);
 *     const saved = this.saveTheme(theme);
 *     
 *     if (saved) {
 *       this.themeSubject.next(theme);
 *     }
 *     
 *     return saved;
 *   }
 *   
 *   toggleTheme(): ThemePreference {
 *     const current = this.getCurrentTheme();
 *     const newTheme: ThemePreference = current === 'dark' ? 'light' : 'dark';
 *     this.setTheme(newTheme);
 *     return newTheme;
 *   }
 *   
 *   initializeTheme(): ThemePreference {
 *     const stored = this.loadTheme();
 *     this.applyThemeToDOM(stored);
 *     this.themeSubject.next(stored);
 *     return stored;
 *   }
 *   
 *   private applyThemeToDOM(theme: ThemePreference): void {
 *     if (theme === 'light') {
 *       document.body.classList.add(this.LIGHT_THEME_CLASS);
 *     } else {
 *       document.body.classList.remove(this.LIGHT_THEME_CLASS);
 *     }
 *   }
 *   
 *   private loadTheme(): ThemePreference {
 *     try {
 *       const stored = localStorage.getItem(this.STORAGE_KEY);
 *       return this.isValidTheme(stored) ? stored : this.DEFAULT_THEME;
 *     } catch {
 *       return this.DEFAULT_THEME;
 *     }
 *   }
 *   
 *   private saveTheme(theme: ThemePreference): boolean {
 *     try {
 *       localStorage.setItem(this.STORAGE_KEY, theme);
 *       return true;
 *     } catch {
 *       try {
 *         sessionStorage.setItem(this.STORAGE_KEY, theme);
 *         return true;
 *       } catch {
 *         return false;
 *       }
 *     }
 *   }
 *   
 *   private isValidTheme(value: unknown): value is ThemePreference {
 *     return value === 'dark' || value === 'light';
 *   }
 * }
 * ```
 */
