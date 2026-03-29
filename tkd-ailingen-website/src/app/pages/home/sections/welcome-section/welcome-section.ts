import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubInfo } from '@shared/models';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';

/**
 * Welcome section component displaying club description
 * Programs are now displayed in dedicated sections (ZumbaSection, DeepworkSection)
 */
@Component({
  selector: 'app-welcome-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.scss',
})
export class WelcomeSection {
  @Input() clubInfo?: ClubInfo;

  constructor(public translationService: TranslationService) {}
}
