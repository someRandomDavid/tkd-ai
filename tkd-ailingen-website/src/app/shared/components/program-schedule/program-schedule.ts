import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { TrainingSession, DayOfWeek } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';

/**
 * Program schedule component displaying training sessions
 * Shows day, time, location, instructor, and level for each session
 */
@Component({
  selector: 'app-program-schedule',
  imports: [CommonModule, MaterialModule],
  templateUrl: './program-schedule.html',
  styleUrl: './program-schedule.scss',
})
export class ProgramSchedule {
  @Input() sessions: TrainingSession[] = [];
  @Input() programType = '';
  @Input() programName = '';

  constructor(public translationService: TranslationService) {}

  get filteredSessions(): TrainingSession[] {
    if (!this.programType) return this.sessions;
    return this.sessions.filter((s) => s.programType === this.programType);
  }

  getDayName(day: DayOfWeek): string {
    const dayMap: Record<DayOfWeek, string> = {
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
    };
    return dayMap[day] || day;
  }
}
