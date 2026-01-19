import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstagramService, InstagramPost } from '../../../../services/instagram.service';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-instagram-section',
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './instagram-section.html',
  styleUrls: ['./instagram-section.scss']
})
export class InstagramSection implements OnInit {
  posts = signal<InstagramPost[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private instagramService: InstagramService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.instagramService.getPosts(12).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load Instagram posts:', err);
        this.error.set('Failed to load Instagram posts');
        this.loading.set(false);
      }
    });
  }

  getPostDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getTruncatedCaption(caption: string | undefined, maxLength: number = 80): string {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  }
}
