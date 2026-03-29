import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Dedicated deepWORK program section with detailed information
 */
@Component({
  selector: 'app-deepwork-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './deepwork-section.html',
  styleUrl: './deepwork-section.scss',
})
export class DeepworkSection {
  videoUrl = 'https://www.youtube.com/embed/qQCsFQjcH0A';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeVideoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
}
