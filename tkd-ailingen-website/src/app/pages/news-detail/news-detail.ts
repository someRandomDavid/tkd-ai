import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { NewsItem } from '@shared/models/news.model';

/**
 * News detail page component
 * Displays full content of a single news article
 */
@Component({
  selector: 'app-news-detail',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetail implements OnInit {
  newsItem?: NewsItem;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    if (newsId) {
      this.loadNewsItem(newsId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadNewsItem(id: string): void {
    this.http.get<{ news: NewsItem[] }>('/assets/data/news.json')
      .subscribe({
        next: (data) => {
          this.newsItem = data.news.find(item => item.id === id);
          if (!this.newsItem) {
            this.error = true;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading news:', error);
          this.error = true;
          this.loading = false;
        }
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

  goBack(): void {
    this.router.navigate(['/'], { fragment: 'news-section' });
  }
}
