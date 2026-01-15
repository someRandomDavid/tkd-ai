import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ThemeService } from './theme.service';
import { DEFAULT_THEME } from '../models/theme.types';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Restore and clear all mocks first
    vi.restoreAllMocks();
    vi.clearAllMocks();
    
    // Create service instance directly (no TestBed needed for this simple service)
    service = new ThemeService();
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Clear body classes
    document.body.className = '';
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to dark theme', () => {
    expect(service.getCurrentTheme()).toBe(DEFAULT_THEME);
  });

  describe('setTheme', () => {
    it('should update current theme to light', () => {
      const result = service.setTheme('light');
      expect(result).toBe(true);
      expect(service.getCurrentTheme()).toBe('light');
    });

    it('should update current theme to dark', () => {
      service.setTheme('light'); // First set to light
      const result = service.setTheme('dark');
      expect(result).toBe(true);
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should apply light-theme class to body for light theme', () => {
      service.setTheme('light');
      expect(document.body.classList.contains('light-theme')).toBe(true);
      expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    it('should remove light-theme class from body for dark theme', () => {
      service.setTheme('light');
      service.setTheme('dark');
      expect(document.body.classList.contains('light-theme')).toBe(false);
      expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    it('should return false for invalid theme value', () => {
      const result = service.setTheme('invalid' as any);
      expect(result).toBe(false);
      expect(service.getCurrentTheme()).toBe(DEFAULT_THEME);
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('light');
      expect(localStorage.getItem('theme-preference')).toBe('light');
    });
  });

  describe('localStorage persistence', () => {
    it('should save theme to localStorage on setTheme', () => {
      service.setTheme('light');
      expect(localStorage.getItem('theme-preference')).toBe('light');
      
      service.setTheme('dark');
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      expect(service.getCurrentTheme()).toBe('dark');
      service.toggleTheme();
      expect(service.getCurrentTheme()).toBe('light');
    });

    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();
      expect(service.getCurrentTheme()).toBe('dark');
    });

    it('should apply correct body class when toggling', () => {
      service.toggleTheme(); // dark -> light
      expect(document.body.classList.contains('light-theme')).toBe(true);
      
      service.toggleTheme(); // light -> dark
      expect(document.body.classList.contains('light-theme')).toBe(false);
    });
  });

  describe('initializeTheme', () => {
    it('should load saved theme from localStorage', () => {
      localStorage.setItem('theme-preference', 'light');
      
      // Create new service instance to trigger initialization
      const newService = new ThemeService();
      newService.initializeTheme();
      
      expect(newService.getCurrentTheme()).toBe('light');
    });

    it('should default to dark theme when no saved preference', () => {
      // localStorage is already clear from beforeEach
      const newService = new ThemeService();
      newService.initializeTheme();
      
      expect(newService.getCurrentTheme()).toBe('dark');
    });

    it('should default to dark theme when localStorage has invalid data', () => {
      localStorage.setItem('theme-preference', 'invalid-theme');
      
      const newService = new ThemeService();
      newService.initializeTheme();
      
      expect(newService.getCurrentTheme()).toBe('dark');
    });
    
    it('should only initialize once', () => {
      const result1 = service.initializeTheme();
      const result2 = service.initializeTheme();
      
      expect(result1).toBe(result2);
    });
  });
});
