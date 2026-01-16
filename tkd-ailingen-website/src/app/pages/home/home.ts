import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { NavigationHeader } from '@app/shared/components/navigation-header/navigation-header';
import { HeroSection } from '@app/shared/components/hero-section/hero-section';
import { WelcomeSection } from './sections/welcome-section/welcome-section';
import { SchedulesSection } from './sections/schedules-section/schedules-section';
import { TrainersSection } from './sections/trainers-section/trainers-section';
import { DownloadsSection } from './sections/downloads-section/downloads-section';
import { Footer } from '@app/shared/components/footer/footer';
import { ContentService } from '@core/services/content.service';
import { ClubInfo, NavigationItem, TrainingSession, DownloadableForm } from '@shared/models';

/**
 * Homepage container component
 * Per constitution principle IV (Static-First):
 * - Loads all data from static JSON files via ContentService
 * - No external API calls
 */
@Component({
  selector: 'app-home',
  imports: [CommonModule, NavigationHeader, HeroSection, WelcomeSection, SchedulesSection, TrainersSection, DownloadsSection, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  clubInfo?: ClubInfo;
  navItems: NavigationItem[] = [];
  trainingSessions: TrainingSession[] = [];
  downloadableForms: DownloadableForm[] = [];
  loading = true;
  error = false;

  constructor(
    private contentService: ContentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load all data in parallel using firstValueFrom
    Promise.all([
      firstValueFrom(this.contentService.getClubInfo()),
      firstValueFrom(this.contentService.getNavigation()),
      firstValueFrom(this.contentService.getTrainingSessions()),
      firstValueFrom(this.contentService.getDownloads()),
    ])
      .then(([clubInfo, nav, sessions, downloads]) => {
        this.clubInfo = clubInfo;
        this.navItems = nav?.items || [];
        this.trainingSessions = sessions || [];
        this.downloadableForms = downloads?.forms || [];
        this.loading = false;
        this.cdr.markForCheck();
      })
      .catch((err) => {
        console.error('Failed to load homepage data:', err);
        this.error = true;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }

  onNavigationClick(route: string): void {
    // Navigation handled by NavigationHeader component
  }
}
