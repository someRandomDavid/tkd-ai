import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

/**
 * Imprint/Impressum page component
 * Legal information required by German law (§5 TMG)
 */
@Component({
  selector: 'app-imprint',
  imports: [CommonModule],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
  standalone: true
})
export class ImprintPage {
  constructor(public translationService: TranslationService) {}
}
