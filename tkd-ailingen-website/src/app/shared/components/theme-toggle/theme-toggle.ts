import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';

/**
 * Theme toggle button component
 * Displays an icon button that switches between dark and light themes
 * Shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark)
 */
@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  standalone: true
})
export class ThemeToggle implements OnInit {
  private themeService = inject(ThemeService);
  private translationService = inject(TranslationService);

  ngOnInit() {
    // Component initialized
  }

  /**
   * Computed signal for current theme
   */
  currentTheme = this.themeService.getThemeSignal();

  /**
   * Handle toggle button click
   */
  onToggle(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Get the icon name based on current theme
   * Shows the icon for the theme you'll switch TO (not the current theme)
   */
  getIcon(): string {
    return this.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode';
  }

  /**
   * Get ARIA label for screen readers with translation
   */
  getAriaLabel(): string {
    const targetThemeKey = this.currentTheme() === 'dark' ? 'theme.light' : 'theme.dark';
    const targetTheme = this.translationService.instant(targetThemeKey);
    return this.translationService.instant('theme.switchTo', { theme: targetTheme });
  }
}

