import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { NewsItem } from '@shared/models/news.model';

/**
 * Service for managing news data
 * Caches news data to avoid repeated HTTP requests
 */
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsCache$?: Observable<NewsItem[]>;

  constructor(private http: HttpClient) {}

  /**
   * Get all news items (cached)
   */
  getAllNews(): Observable<NewsItem[]> {
    if (!this.newsCache$) {
      this.newsCache$ = this.http.get<{ news: NewsItem[] }>('/assets/data/news.json').pipe(
        map(response => response.news),
        tap(news => console.log('News loaded from server:', news.length, 'items')),
        shareReplay(1) // Cache the result
      );
    }
    return this.newsCache$;
  }

  /**
   * Get a single news item by ID
   */
  getNewsById(id: string): Observable<NewsItem | undefined> {
    return this.getAllNews().pipe(
      map(news => {
        const item = news.find(n => n.id === id);
        console.log('getNewsById:', id, 'found:', !!item);
        return item;
      })
    );
  }

  /**
   * Get news sorted by date (newest first)
   */
  getNewsSortedByDate(): Observable<NewsItem[]> {
    return this.getAllNews().pipe(
      map(news => [...news].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ))
    );
  }
}
