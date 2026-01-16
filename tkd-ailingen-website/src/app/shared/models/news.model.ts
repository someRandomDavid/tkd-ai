/**
 * News item model
 * Represents a news article or announcement
 */

export interface NewsItem {
  id: string;
  title: string;
  date: string; // ISO 8601 format
  content: string;
  excerpt: string;
  imageUrl?: string;
  author?: string;
  category?: 'event' | 'announcement' | 'achievement' | 'general';
}

export interface PaginatedNews {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
