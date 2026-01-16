import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ClubInfo } from '@shared/models';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';

/**
 * Welcome section component displaying club description and programs
 * Per spec SC-005: Max 200 words content, highlights 3 programs
 */
@Component({
  selector: 'app-welcome-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.scss',
})
export class WelcomeSection {
  @Input() clubInfo?: ClubInfo;

  constructor(
    public translationService: TranslationService,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Sanitize video URL for Facebook embed
   */
  getSafeVideoUrl(url: string): SafeResourceUrl {
    // Convert Facebook video URL to embed format
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
