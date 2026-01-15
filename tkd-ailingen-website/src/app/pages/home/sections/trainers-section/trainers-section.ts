import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { TrainerCard } from '@shared/components/trainer-card/trainer-card';
import { Trainer } from '@shared/models';

/**
 * Trainers section component
 * Displays directory of trainers with alphabetical sorting
 */
@Component({
  selector: 'app-trainers-section',
  imports: [CommonModule, MaterialModule, TrainerCard],
  templateUrl: './trainers-section.html',
  styleUrl: './trainers-section.scss',
})
export class TrainersSection implements OnInit {
  trainers = signal<Trainer[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadTrainers();
  }

  /**
   * Load trainers from JSON file and sort alphabetically
   */
  private loadTrainers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Trainer[]>('/assets/data/trainers.json').subscribe({
      next: (trainers) => {
        const sorted = this.sortTrainers(trainers);
        this.trainers.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load trainers:', err);
        this.error.set('trainers.loadError');
        this.loading.set(false);
      },
    });
  }

  /**
   * Sort trainers alphabetically by last name using German locale
   */
  private sortTrainers(trainers: Trainer[]): Trainer[] {
    return [...trainers].sort((a, b) => {
      return a.sortKey.localeCompare(b.sortKey, 'de-DE');
    });
  }
}
