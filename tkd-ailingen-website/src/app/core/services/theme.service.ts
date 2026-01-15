import { Injectable, signal } from '@angular/core';
import { Theme, THEME_STORAGE_KEY, DEFAULT_THEME } from '../models/theme.types';

/**
 * Service for managing application theme (dark/light mode)
 * Handles theme switching, persistence in localStorage, and application of theme classes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSignal = signal<Theme>(DEFAULT_THEME);
  private initialized = false;

  constructor() {
    // Theme will be initialized by AppComponent
    // This prevents double initialization during SSR/hydration
  }

  /**
   * Initialize theme from localStorage or system preference
   * Should be called once on app startup
   * @returns The initialized theme
   */
  initializeTheme(): Theme {
    if (this.initialized) {
      return this.currentThemeSignal();
    }
    
    this.initialized = true;
    
    // Try loading from localStorage first
    const savedTheme = this.loadThemeFromStorage();
    
    let themeToApply: Theme;
    
    if (savedTheme) {
      // Use saved preference
      themeToApply = savedTheme;
    } else {
      // No saved preference - use DEFAULT_THEME (dark mode)
      // Note: FR-002 requires dark mode as default, overriding OS preference
      themeToApply = DEFAULT_THEME;
    }
    
    // Update signal without reapplying body class (already applied by inline script)
    this.currentThemeSignal.set(themeToApply);
    
    return themeToApply;
  }

  /**
   * Get the current active theme
   * @returns Current theme ('dark' or 'light')
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSignal();
  }

  /**
   * Get the current theme as a signal (reactive)
   * @returns Signal containing current theme
   */
  getThemeSignal() {
    return this.currentThemeSignal.asReadonly();
  }

  /**
   * Toggle between dark and light themes
   * @returns true if toggle was successful, false otherwise
   */
  toggleTheme(): boolean {
    const newTheme: Theme = this.currentThemeSignal() === 'dark' ? 'light' : 'dark';
    return this.setTheme(newTheme);
  }

  /**
   * Set the application theme
   * Updates the theme signal and applies the theme class to the body element
   * @param theme - The theme to apply ('dark' or 'light')
   * @returns true if theme was successfully applied, false otherwise
   */
  setTheme(theme: Theme): boolean {
    try {
      // Validate theme value
      if (theme !== 'dark' && theme !== 'light') {
        console.error(`Invalid theme value: ${theme}`);
        return false;
      }

      // Persist to localStorage FIRST
      this.saveThemeToStorage(theme);

      // Update signal
      this.currentThemeSignal.set(theme);

      // Apply theme class to body (only on client side)
      if (typeof document !== 'undefined') {
        const body = document.body;
        
        // Apply theme atomically - remove old, add new in one go
        if (theme === 'light') {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
        } else {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
        }
      }

      return true;
    } catch (error) {
      console.error('Error setting theme:', error);
      return false;
    }
  }

  /**
   * Save theme preference to localStorage
   * @param theme - The theme to save
   */
  private saveThemeToStorage(theme: Theme): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
      // Gracefully handle localStorage errors (e.g., private browsing, storage disabled)
    }
  }

  /**
   * Load theme preference from localStorage
   * @returns The saved theme, or null if not found or invalid
   */
  private loadThemeFromStorage(): Theme | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        
        // Validate the saved value
        if (saved === 'dark' || saved === 'light') {
          return saved;
        }
        
        // Clear invalid data
        if (saved !== null) {
          console.warn('Invalid theme data in localStorage, clearing');
          localStorage.removeItem(THEME_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    
    return null;
  }
}
