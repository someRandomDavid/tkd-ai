import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(public translationService: TranslationService) {}
}
