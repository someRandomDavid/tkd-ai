import { Component, OnInit, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { TrainerCard } from '@shared/components/trainer-card/trainer-card';
import { Trainer } from '@shared/models';

const TRAINER_SEARCH_STORAGE_KEY = 'trainer-search-query';

/**
 * Trainers section component
 * Displays directory of trainers with alphabetical sorting
 */
@Component({
  selector: 'app-trainers-section',
  imports: [CommonModule, FormsModule, MaterialModule, TrainerCard],
  templateUrl: './trainers-section.html',
  styleUrl: './trainers-section.scss',
})
export class TrainersSection implements OnInit {
  private allTrainers = signal<Trainer[]>([]);
  searchQuery = signal<string>('');
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  private isBrowser: boolean;

  // Computed filtered trainers based on search query
  trainers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.allTrainers();
    }

    // Split by comma for multi-search
    const searchTerms = query.split(',').map(term => term.trim()).filter(term => term);
    
    return this.allTrainers().filter(trainer => {
      // Check if ALL search terms match (AND logic)
      return searchTerms.every(term => {
        // Search in fullName
        if (trainer.fullName.toLowerCase().includes(term)) return true;
        
        // Search in programs (translated only)
        if (trainer.programs.some(program => {
          const translated = this.translationService.instant(`trainers.programTypes.${program}`).toLowerCase();
          return translated.includes(term);
        })) return true;
        
        // Search in sessions
        if (trainer.sessions?.some(session => session.toLowerCase().includes(term))) return true;
        
        // Search in specialRoles (translated only)
        if (trainer.specialRoles?.some(role => {
          const translated = this.translationService.instant(`trainers.specialRoles.${role}`).toLowerCase();
          return translated.includes(term);
        })) return true;
        
        // Search in role (translated only)
        if (trainer.role) {
          const translatedRole = this.translationService.instant(`trainers.roles.${trainer.role}`).toLowerCase();
          if (translatedRole.includes(term)) return true;
        }
        
        return false;
      });
    });
  });

  constructor(
    private http: HttpClient,
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadSearchFromStorage();
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
        this.allTrainers.set(sorted);
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

  /**
   * Load search query from localStorage
   */
  private loadSearchFromStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const saved = localStorage.getItem(TRAINER_SEARCH_STORAGE_KEY);
      if (saved) {
        this.searchQuery.set(saved);
      }
    } catch (error) {
      console.error('Failed to load search query from localStorage:', error);
    }
  }

  /**
   * Save search query to localStorage
   */
  private saveSearchToStorage(query: string): void {
    if (!this.isBrowser) return;
    
    try {
      if (query) {
        localStorage.setItem(TRAINER_SEARCH_STORAGE_KEY, query);
      } else {
        localStorage.removeItem(TRAINER_SEARCH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save search query to localStorage:', error);
    }
  }

  /**
   * Handle search input change
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.saveSearchToStorage(query);
  }

  /**
   * Clear search filter
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.saveSearchToStorage('');
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    if (this.isBrowser) {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    }
  }
}
