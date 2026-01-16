import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  ClubInfo,
  TrainingSchedule,
  TrainingSession,
  DownloadsCollection,
  CTACollection,
  Navigation,
} from '@shared/models';

/**
 * Content service for loading static JSON data
 * Per constitution principle IV (Static-First):
 * - All content loaded from static JSON files
 * - No API calls required
 * - Content managed through assets/data/ directory
 */
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private readonly DATA_PATH = '/assets/data';

  constructor(private http: HttpClient) {}

  /**
   * Get club information (name, tagline, contact, programs)
   */
  getClubInfo(): Observable<ClubInfo> {
    return this.http
      .get<ClubInfo>(`${this.DATA_PATH}/club-info.json`)
      .pipe(catchError(this.handleError<ClubInfo>('getClubInfo')));
  }

  /**
   * Get all training sessions
   * @param programType Optional filter by program type
   */
  getTrainingSessions(programType?: string): Observable<TrainingSession[]> {
    return this.http.get<TrainingSchedule>(`${this.DATA_PATH}/training-sessions.json`).pipe(
      map((schedule) => {
        const sessions = schedule.sessions;
        return programType ? sessions.filter((s) => s.programType === programType) : sessions;
      }),
      catchError(this.handleError<TrainingSession[]>('getTrainingSessions', []))
    );
  }

  /**
   * Get downloadable forms (registration, event forms)
   */
  getDownloads(): Observable<DownloadsCollection> {
    return this.http
      .get<DownloadsCollection>(`${this.DATA_PATH}/downloads.json`)
      .pipe(catchError(this.handleError<DownloadsCollection>('getDownloads')));
  }

  /**
   * Get call-to-action buttons
   */
  getCTAButtons(): Observable<CTACollection> {
    return this.http
      .get<CTACollection>(`${this.DATA_PATH}/cta-buttons.json`)
      .pipe(catchError(this.handleError<CTACollection>('getCTAButtons')));
  }

  /**
   * Get navigation menu items
   */
  getNavigation(): Observable<Navigation> {
    return this.http
      .get<Navigation>(`${this.DATA_PATH}/navigation.json`)
      .pipe(catchError(this.handleError<Navigation>('getNavigation')));
  }

  /**
   * Handle Http operation that failed
   * @param operation Name of the operation that failed
   * @param result Optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return empty result to keep app running
      return of(result as T);
    };
  }
}
