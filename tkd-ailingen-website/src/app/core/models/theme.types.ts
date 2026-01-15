/**
 * Theme type for the application
 * Supports dark and light modes
 */
export type Theme = 'dark' | 'light';

/**
 * localStorage key for storing theme preference
 */
export const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Default theme applied on first visit (when no saved preference exists)
 */
export const DEFAULT_THEME: Theme = 'dark';
