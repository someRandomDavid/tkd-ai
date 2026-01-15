import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { NavigationItem } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

/**
 * Navigation header component with responsive menu
 * Per constitution principle III (Mobile-First):
 * - Hamburger menu <768px
 * - Inline navigation ≥768px
 * - Smooth scroll to anchors
 */
@Component({
  selector: 'app-navigation-header',
  imports: [CommonModule, MaterialModule, ThemeToggle],
  templateUrl: './navigation-header.html',
  styleUrl: './navigation-header.scss',
})
export class NavigationHeader implements OnInit {
  @Input() navItems: NavigationItem[] = [];
  @Output() navigationClick = new EventEmitter<string>();
  
  @ViewChild('sidenav') sidenav?: MatSidenav;
  
  activeSection = '';
  isMobile = false;

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.checkViewport();
    window.addEventListener('resize', () => this.checkViewport());
    window.addEventListener('scroll', () => this.updateActiveSection());
  }

  checkViewport(): void {
    this.isMobile = window.innerWidth < 768;
  }

  updateActiveSection(): void {
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
    console.log('NavigationHeader.onNavigationClick called with:', item);
    this.navigationClick.emit(item.routeOrAnchor);
    console.log('Event emitted, routeOrAnchor:', item.routeOrAnchor);
    
    if (item.routeOrAnchor.startsWith('#')) {
      // Smooth scroll to anchor
      const targetId = item.routeOrAnchor.substring(1);
      console.log('Looking for element with ID:', targetId);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        console.log('Element found, scrolling to:', targetElement);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.error('Element not found with ID:', targetId);
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
