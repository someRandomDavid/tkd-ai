import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfo, SocialMediaLink } from '@shared/models';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';

/**
 * Footer component displaying contact information and social media links
 * Per constitution principle III (Mobile-First):
 * - Stacked layout on mobile
 * - Grid layout on tablet+
 */
@Component({
  selector: 'app-footer',
  imports: [CommonModule, MaterialModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input() contact?: ContactInfo;
  @Input() socialMedia: SocialMediaLink[] = [];
  
  currentYear = new Date().getFullYear();

  constructor(public translationService: TranslationService) {}
}
