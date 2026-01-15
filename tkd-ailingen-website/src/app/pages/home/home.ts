import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { NavigationHeader } from '@app/shared/components/navigation-header/navigation-header';
import { HeroSection } from '@app/shared/components/hero-section/hero-section';
import { WelcomeSection } from './sections/welcome-section/welcome-section';
import { SchedulesSection } from './sections/schedules-section/schedules-section';
import { TrainersSection } from './sections/trainers-section/trainers-section';
import { DownloadsSection } from './sections/downloads-section/downloads-section';
import { CTASection } from './sections/cta-section/cta-section';
import { Footer } from '@app/shared/components/footer/footer';
import { ContentService } from '@core/services/content.service';
import { ClubInfo, NavigationItem, TrainingSession, DownloadableForm, CTAButton } from '@shared/models';

/**
 * Homepage container component
 * Per constitution principle IV (Static-First):
 * - Loads all data from static JSON files via ContentService
 * - No external API calls
 */
@Component({
  selector: 'app-home',
  imports: [CommonModule, NavigationHeader, HeroSection, WelcomeSection, SchedulesSection, TrainersSection, DownloadsSection, CTASection, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  clubInfo?: ClubInfo;
  navItems: NavigationItem[] = [];
  trainingSessions: TrainingSession[] = [];
  downloadableForms: DownloadableForm[] = [];
  ctaButtons: CTAButton[] = [];
  loading = true;
  error = false;

  constructor(
    private contentService: ContentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('HomePage ngOnInit started');
    // Load all data in parallel using firstValueFrom
    Promise.all([
      firstValueFrom(this.contentService.getClubInfo()),
      firstValueFrom(this.contentService.getNavigation()),
      firstValueFrom(this.contentService.getTrainingSessions()),
      firstValueFrom(this.contentService.getDownloads()),
      firstValueFrom(this.contentService.getCTAButtons()),
    ])
      .then(([clubInfo, nav, sessions, downloads, ctas]) => {
        console.log('Data loaded successfully:', { clubInfo, nav, sessions, downloads, ctas });
        this.clubInfo = clubInfo;
        this.navItems = nav?.items || [];
        this.trainingSessions = sessions || [];
        this.downloadableForms = downloads?.forms || [];
        this.ctaButtons = ctas?.actions || [];
        this.loading = false;
        console.log('Loading flag set to false:', this.loading);
        console.log('Error flag:', this.error);
        console.log('ClubInfo:', this.clubInfo);
        this.cdr.markForCheck();
        console.log('markForCheck called');
      })
      .catch((err) => {
        console.error('Failed to load data - FULL ERROR:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = true;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }

  onNavigationClick(route: string): void {
    console.log('Navigation clicked:', route);
  }
}
