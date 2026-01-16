import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

/**
 * Privacy Policy/Datenschutzerklärung page component
 * GDPR-compliant privacy policy required by German law
 */
@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  standalone: true
})
export class PrivacyPolicy {
  constructor(public translationService: TranslationService) {}
}
