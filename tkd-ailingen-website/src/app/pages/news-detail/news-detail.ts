import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { NewsService } from '@core/services/news.service';
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
export class NewsDetail implements OnInit, OnDestroy {
  newsItem?: NewsItem;
  error = false;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private sanitizer: DomSanitizer,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // Subscribe to route params to handle navigation between news items
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const newsId = params.get('id');
      
      // Scroll to top when navigating to a new news item
      window.scrollTo({ top: 0 });
      
      // Reset state
      this.error = false;
      this.newsItem = undefined;
      
      if (newsId) {
        this.loadNewsItem(newsId);
      } else {
        this.error = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private loadNewsItem(id: string): void {
    this.newsService.getNewsById(id).subscribe({
      next: (item) => {
        if (item) {
          this.newsItem = item;
        } else {
          this.error = true;
        }
      },
      error: (err) => {
        console.error('Error loading news item:', err);
        this.error = true;
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Format content with markdown-like syntax to HTML
   */
  formatContent(content: string): SafeHtml {
    let html = content
      // Convert **bold** to <strong>
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Convert bullet points
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Wrap paragraphs
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        
        // Check if paragraph contains list items
        if (paragraph.includes('<li>')) {
          return '<ul>' + paragraph + '</ul>';
        }
        
        // Regular paragraph
        return '<p>' + paragraph.replace(/\n/g, '<br>') + '</p>';
      })
      .join('');
    
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
