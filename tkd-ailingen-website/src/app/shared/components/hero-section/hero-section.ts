import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubInfo } from '@shared/models';
import { MaterialModule } from '@shared/material.module';

/**
 * Hero section component displaying club name, tagline, and hero image
 * Per constitution principle III (Mobile-First):
 * - Responsive hero sizing based on viewport
 * - Touch-friendly CTA buttons (min 44px)
 */
@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  @Input() clubInfo?: ClubInfo;

  /**
   * Handle image load event - fade in once loaded
   */
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const picture = img.closest('.hero-image');
    if (picture) {
      picture.classList.add('loaded');
    }
  }
}
