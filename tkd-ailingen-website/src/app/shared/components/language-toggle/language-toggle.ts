import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslationService } from '@core/services/translation.service';

/**
 * Language toggle component
 * Displays a button with dropdown menu to switch between languages
 */
@Component({
  selector: 'app-language-toggle',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.scss',
  standalone: true
})
export class LanguageToggle {
  private translationService = inject(TranslationService);

  /**
   * Get current language code
   */
  getCurrentLanguage(): string {
    return this.translationService.getCurrentLanguage();
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): Array<{code: string, label: string}> {
    return [
      { code: 'de', label: 'Deutsch' },
      { code: 'en', label: 'English' }
    ];
  }

  /**
   * Switch to selected language
   */
  switchLanguage(langCode: string): void {
    this.translationService.setLanguage(langCode);
  }

  /**
   * Get display label for current language
   */
  getCurrentLanguageLabel(): string {
    const current = this.getCurrentLanguage();
    const lang = this.getSupportedLanguages().find(l => l.code === current);
    return lang?.label || 'DE';
  }
}
