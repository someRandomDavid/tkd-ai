import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

/**
 * Disclaimer/Haftungsausschluss page component
 * Legal disclaimer required by German law
 */
@Component({
  selector: 'app-disclaimer',
  imports: [CommonModule],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
  standalone: true
})
export class Disclaimer {
  constructor(public translationService: TranslationService) {}
}
