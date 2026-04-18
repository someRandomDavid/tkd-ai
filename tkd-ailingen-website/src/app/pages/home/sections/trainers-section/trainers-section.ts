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
 * Displays directory of trainers sorted by belt level (Dan/Kup)
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
   * Load trainers from JSON file and sort by belt level
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
   * Sort trainers by belt level (Dan/Kup) and session
   * Order: 4. Dan, 3. Dan, 2. Dan, 1. Dan, 9. Kup, 8. Kup, 7. Kup, etc.
   * Then by session (age groups), then alphabetically
   */
  private sortTrainers(trainers: Trainer[]): Trainer[] {
    return [...trainers].sort((a, b) => {
      const rankA = this.extractBeltRank(a.bio);
      const rankB = this.extractBeltRank(b.bio);
      
      // Compare by type first (Dan > Kup > None)
      if (rankA.type !== rankB.type) {
        if (rankA.type === 'dan') return -1;
        if (rankB.type === 'dan') return 1;
        if (rankA.type === 'kup') return -1;
        if (rankB.type === 'kup') return 1;
      }
      
      // Same type: higher number comes first
      if (rankA.level !== rankB.level) {
        return rankB.level - rankA.level;
      }
      
      // Same belt level: sort by session (first session if multiple)
      const sessionA = a.sessions && a.sessions.length > 0 ? a.sessions[0] : '';
      const sessionB = b.sessions && b.sessions.length > 0 ? b.sessions[0] : '';
      const sessionPriorityA = this.getSessionPriority(sessionA);
      const sessionPriorityB = this.getSessionPriority(sessionB);
      
      if (sessionPriorityA !== sessionPriorityB) {
        return sessionPriorityA - sessionPriorityB;
      }
      
      // Same belt level and session: alphabetically by sortKey
      return a.sortKey.localeCompare(b.sortKey, 'de-DE');
    });
  }

  /**
   * Extract belt rank information from bio field
   */
  private extractBeltRank(bio: string | undefined): { type: 'dan' | 'kup' | 'none'; level: number } {
    if (!bio) {
      return { type: 'none', level: 0 };
    }
    
    // Match patterns like "4. Dan" or "9. Kup"
    const danMatch = bio.match(/(\d+)\.\s*Dan/i);
    if (danMatch) {
      return { type: 'dan', level: parseInt(danMatch[1], 10) };
    }
    
    const kupMatch = bio.match(/(\d+)\.\s*Kup/i);
    if (kupMatch) {
      return { type: 'kup', level: parseInt(kupMatch[1], 10) };
    }
    
    return { type: 'none', level: 0 };
  }

  /**
   * Get priority for session sorting (lower = earlier in list)
   * Sessions are ordered by age group, from youngest to oldest
   */
  private getSessionPriority(session: string): number {
    const sessionOrder: Record<string, number> = {
      'Bambinis 4-7 Anfänger': 1,
      'Bambinis 4-7 Fortgeschritten': 2,
      'Kinder 7-11 Anfänger': 3,
      'Kinder 7-11 Fortgeschritten': 4,
      'Jugend 11-16 Anfänger': 5,
      'Jugend 11-16 Fortgeschritten': 6,
      'Jugend ab 16 / Erwachsene': 7,
      'Erwachsene': 8,
      'Wettkampf': 9,
    };
    
    return sessionOrder[session] ?? 999; // Unknown sessions go to the end
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
