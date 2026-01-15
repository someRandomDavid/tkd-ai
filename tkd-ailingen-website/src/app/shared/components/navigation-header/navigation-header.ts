import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { NavigationItem } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { LanguageToggle } from '../language-toggle/language-toggle';

/**
 * Navigation header component with responsive menu
 * Per constitution principle III (Mobile-First):
 * - Hamburger menu <768px
 * - Inline navigation ≥768px
 * - Smooth scroll to anchors
 */
@Component({
  selector: 'app-navigation-header',
  imports: [CommonModule, MaterialModule, ThemeToggle, LanguageToggle],
  templateUrl: './navigation-header.html',
  styleUrl: './navigation-header.scss',
})
export class NavigationHeader implements OnInit, OnDestroy {
  @Input() navItems: NavigationItem[] = [];
  @Output() navigationClick = new EventEmitter<string>();
  
  @ViewChild('sidenav') sidenav?: MatSidenav;
  
  activeSection = '';
  isMobile = false;
  private isBrowser: boolean;

  constructor(
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkViewport();
      window.addEventListener('resize', () => this.checkViewport());
      window.addEventListener('scroll', () => this.updateActiveSection());
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', () => this.checkViewport());
      window.removeEventListener('scroll', () => this.updateActiveSection());
    }
  }

  checkViewport(): void {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  updateActiveSection(): void {
    if (!this.isBrowser) return;
    
    // Find which section is currently in view
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header height

    sections.forEach((section) => {
      const element = section as HTMLElement;
      if (
        element.offsetTop <= scrollPosition &&
        element.offsetTop + element.offsetHeight > scrollPosition
      ) {
        this.activeSection = element.id;
      }
    });
  }

  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item.routeOrAnchor);
    
    if (this.isBrowser && item.routeOrAnchor.startsWith('#')) {
      // Smooth scroll to anchor
      const targetId = item.routeOrAnchor.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Close mobile menu
      if (this.isMobile && this.sidenav) {
        this.sidenav.close();
      }
    }
  }

  toggleMenu(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  isActive(item: NavigationItem): boolean {
    if (item.routeOrAnchor.startsWith('#')) {
      return this.activeSection === item.routeOrAnchor.substring(1);
    }
    return false;
  }
}
