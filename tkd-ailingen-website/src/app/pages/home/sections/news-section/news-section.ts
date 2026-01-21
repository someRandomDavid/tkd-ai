import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { NewsService } from '@core/services/news.service';
import { NewsItem } from '@shared/models/news.model';

/**
 * News section component with pagination
 * Displays news items in chronological order (newest first)
 */
@Component({
  selector: 'app-news-section',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './news-section.html',
  styleUrl: './news-section.scss',
})
export class NewsSection implements OnInit {
  allNews = signal<NewsItem[]>([]);
  
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
    private newsService: NewsService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  private loadNews(): void {
    this.newsService.getNewsSortedByDate()
      .subscribe({
        next: (news) => {
          this.allNews.set(news);
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
