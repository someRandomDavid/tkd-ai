import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { NewsItem } from '@shared/models/news.model';

/**
 * News section component with pagination
 * Displays news items in chronological order (newest first)
 */
@Component({
  selector: 'app-news-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './news-section.html',
  styleUrl: './news-section.scss',
})
export class NewsSection implements OnInit {
  private allNews = signal<NewsItem[]>([]);
  
  // Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(6);
  
  // Computed values
  totalPages = computed(() => 
    Math.ceil(this.allNews().length / this.pageSize())
  );
  
  paginatedNews = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.allNews().slice(start, end);
  });

  constructor(
    private http: HttpClient,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  private loadNews(): void {
    this.http.get<{ news: NewsItem[] }>('/assets/data/news.json')
      .subscribe({
        next: (data) => {
          // Sort by date descending (newest first)
          const sorted = [...data.news].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.allNews.set(sorted);
        },
        error: (error) => {
          console.error('Error loading news:', error);
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    
    // Scroll to news section top
    document.getElementById('news-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  getCategoryIcon(category?: string): string {
    switch (category) {
      case 'event':
        return 'event';
      case 'announcement':
        return 'campaign';
      case 'achievement':
        return 'emoji_events';
      default:
        return 'article';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      this.translationService.getCurrentLanguage(),
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  }
}
