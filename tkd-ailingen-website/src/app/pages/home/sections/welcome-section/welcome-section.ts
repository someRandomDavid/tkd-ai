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
   * Sanitize video URL for embed (YouTube)
   */
  getSafeVideoUrl(url: string): SafeResourceUrl {
    let embedUrl: string;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Convert YouTube URL to embed format
      const videoId = this.extractYouTubeId(url);
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      // Default: assume it's already an embed URL
      embedUrl = url;
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  /**
   * Extract YouTube video ID from URL
   */
  private extractYouTubeId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  }
}
