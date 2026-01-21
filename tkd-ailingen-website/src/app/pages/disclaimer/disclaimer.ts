import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';
import { MaterialModule } from '@shared/material.module';

/**
 * Disclaimer/Haftungsausschluss page component
 * Legal disclaimer required by German law
 */
@Component({
  selector: 'app-disclaimer',
  imports: [CommonModule, MaterialModule],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
  standalone: true
})
export class Disclaimer {
  constructor(
    public translationService: TranslationService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
