import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Translation service wrapper for ngx-translate.
 * Manages language switching and provides convenient translation methods.
 * 
 * Default language: German (de)
 * Supported languages: German (de), English (en)
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly DEFAULT_LANG = 'de';
  private readonly SUPPORTED_LANGS = ['de', 'en'];

  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }

  private initializeTranslation(): void {
    // Set default language
    this.translate.setDefaultLang(this.DEFAULT_LANG);

    // Use browser language if supported, otherwise fallback to default
    const browserLang = this.translate.getBrowserLang();
    const langToUse = browserLang && this.SUPPORTED_LANGS.includes(browserLang)
      ? browserLang
      : this.DEFAULT_LANG;

    this.translate.use(langToUse);
  }

  /**
   * Change the current language
   * @param lang Language code ('de' or 'en')
   */
  setLanguage(lang: string): void {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      this.translate.use(lang);
    }
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang || this.DEFAULT_LANG;
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGS];
  }

  /**
   * Instantly translate a key
   * @param key Translation key
   * @param params Optional interpolation parameters
   */
  instant(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }
}
