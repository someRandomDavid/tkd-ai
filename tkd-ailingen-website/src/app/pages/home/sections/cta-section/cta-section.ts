import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { CTAButton, CallToAction } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';

/**
 * Call-to-action section with primary action buttons
 * Per User Story 4: "Free Trial Class" (mailto) and "Contact Us" (route)
 * Mobile-first: Buttons stack on mobile, inline on desktop
 */
@Component({
  selector: 'app-cta-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CTASection {
  @Input() buttons: CTAButton[] = [];

  constructor(public translationService: TranslationService) {}

  onCTAClick(button: CTAButton): void {
    if (button.actionType === 'mailto') {
      // Open email client with pre-filled subject
      window.location.href = button.destination;
    } else if (button.destination.startsWith('#')) {
      // Scroll to section
      const targetId = button.destination.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (button.actionType === 'route') {
      // Navigate to route (future implementation)
      console.log('Navigate to:', button.destination);
    } else if (button.actionType === 'external') {
      // Open external URL in new tab
      window.open(button.destination, '_blank', 'noopener,noreferrer');
    }
  }
}
