import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { Trainer } from '@shared/models';

/**
 * Trainer card component
 * Displays individual trainer profile in a card format
 */
@Component({
  selector: 'app-trainer-card',
  imports: [CommonModule, MaterialModule],
  templateUrl: './trainer-card.html',
  styleUrl: './trainer-card.scss',
})
export class TrainerCard {
  @Input() trainer!: Trainer;

  constructor(public translationService: TranslationService) {}

  /**
   * Get initials from trainer name for fallback avatar
   */
  get trainerInitials(): string {
    return `${this.trainer.firstName.charAt(0)}${this.trainer.lastName.charAt(0)}`;
  }

  /**
   * Handle image load error - show fallback
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Fallback will be shown via CSS
  }
}
