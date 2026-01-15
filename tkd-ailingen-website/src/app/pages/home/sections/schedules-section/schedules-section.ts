import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { ProgramSchedule } from '@app/shared/components/program-schedule/program-schedule';
import { ScheduleFilter } from '@app/shared/components/schedule-filter/schedule-filter';
import { TrainingSession, ScheduleFilters, DEFAULT_FILTERS } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';

/**
 * Schedules section component displaying all program schedules
 * Contains schedule for Taekwon-do, Zumba, and deepWORK with filtering
 */
@Component({
  selector: 'app-schedules-section',
  imports: [CommonModule, MaterialModule, ProgramSchedule, ScheduleFilter],
  templateUrl: './schedules-section.html',
  styleUrl: './schedules-section.scss',
})
export class SchedulesSection {
  @Input() sessions: TrainingSession[] = [];

  filters = signal<ScheduleFilters>({ ...DEFAULT_FILTERS });
  
  filteredSessions = computed(() => {
    const allSessions = this.sessions;
    const currentFilters = this.filters();

    return allSessions.filter(session => {
      // Program type filter
      if (currentFilters.programType !== 'all' && session.programType !== currentFilters.programType) {
        return false;
      }

      // Search text filter (searches in multiple fields)
      if (currentFilters.searchText) {
        const searchLower = currentFilters.searchText.toLowerCase();
        const searchableText = [
          session.levelAgeGroup,
          session.instructor,
          session.location,
          session.notes,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  });

  constructor(public translationService: TranslationService) {}

  onFiltersChange(newFilters: ScheduleFilters): void {
    this.filters.set(newFilters);
  }

  get taekwondoSessions(): TrainingSession[] {
    return this.filteredSessions().filter(s => s.programType === 'taekwondo');
  }

  get zumbaSessions(): TrainingSession[] {
    return this.filteredSessions().filter(s => s.programType === 'zumba');
  }

  get deepworkSessions(): TrainingSession[] {
    return this.filteredSessions().filter(s => s.programType === 'deepwork');
  }
}
