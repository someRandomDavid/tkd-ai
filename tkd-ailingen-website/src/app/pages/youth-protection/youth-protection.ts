import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

/**
 * Youth Protection/Jugendschutz page component
 * Youth protection information required for sports clubs
 */
@Component({
  selector: 'app-youth-protection',
  imports: [CommonModule],
  templateUrl: './youth-protection.html',
  styleUrl: './youth-protection.scss',
  standalone: true
})
export class YouthProtection {
  constructor(public translationService: TranslationService) {}
}
