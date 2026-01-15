import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from '@core/services/translation.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('tkd-ailingen-website');

  constructor(
    private translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Initialize translations with German as default
    this.translationService.setLanguage('de');
    
    // Initialize theme (loads from localStorage or uses default)
    // Note: inline script in index.html applies theme class early to prevent FOUC
    // This ensures Angular service state matches the applied theme
    this.themeService.initializeTheme();
  }
}
