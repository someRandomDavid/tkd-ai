import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
}

export interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  // Access token from environment configuration
  // For production, consider fetching this from a secure backend API
  private readonly ACCESS_TOKEN = environment.instagram.accessToken;
  private readonly API_BASE = 'https://graph.instagram.com/me';
  
  constructor(private http: HttpClient) {}

  /**
   * Fetch Instagram posts from the authenticated user's account
   * @param limit Number of posts to fetch (default: 12)
   */
  getPosts(limit: number = 12): Observable<InstagramPost[]> {
    if (this.ACCESS_TOKEN === 'YOUR_INSTAGRAM_ACCESS_TOKEN') {
      console.warn('Instagram access token not configured. Using mock data.');
      return of(this.getMockPosts());
    }

    const fields = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url';
    const url = `${this.API_BASE}/media?fields=${fields}&access_token=${this.ACCESS_TOKEN}&limit=${limit}`;

    return this.http.get<InstagramResponse>(url).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching Instagram posts:', error);
        return of(this.getMockPosts());
      })
    );
  }

  /**
   * Mock data for development/testing
   */
  private getMockPosts(): InstagramPost[] {
    return [
      {
        id: '1',
        caption: 'Training session with our amazing team! 🥋 #Taekwondo #MartialArts',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_1.JPG',
        permalink: 'https://www.instagram.com/p/example1/',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        caption: 'Belt examination day! Congratulations to all participants 🎉',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_2.JPG',
        permalink: 'https://www.instagram.com/p/example2/',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        caption: 'Intense training preparing for the championship 💪',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_3.JPG',
        permalink: 'https://www.instagram.com/p/example3/',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        caption: 'Our dojo - where champions are made! 🏆',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_4.JPG',
        permalink: 'https://www.instagram.com/p/example4/',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        caption: 'Kids class showing great technique! 👏',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_5.JPG',
        permalink: 'https://www.instagram.com/p/example5/',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        caption: 'Team spirit! 🥋❤️ #TaekwondoFamily',
        media_type: 'IMAGE',
        media_url: 'assets/images/location/location_6.JPG',
        permalink: 'https://www.instagram.com/p/example6/',
        timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}
