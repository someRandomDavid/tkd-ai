import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';
import { MaterialModule } from '@shared/material.module';

/**
 * Youth Protection/Jugendschutz page component
 * Youth protection information required for sports clubs
 */
@Component({
  selector: 'app-youth-protection',
  imports: [CommonModule, MaterialModule],
  templateUrl: './youth-protection.html',
  styleUrl: './youth-protection.scss',
  standalone: true
})
export class YouthProtection {
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
