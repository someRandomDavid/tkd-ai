import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramSchedule } from '@app/shared/components/program-schedule/program-schedule';
import { TrainingSession } from '@shared/models';
import { TranslationService } from '@core/services/translation.service';

/**
 * Schedules section component displaying all program schedules
 * Contains schedule for Taekwon-do, Zumba, and deepWORK
 */
@Component({
  selector: 'app-schedules-section',
  imports: [CommonModule, ProgramSchedule],
  templateUrl: './schedules-section.html',
  styleUrl: './schedules-section.scss',
})
export class SchedulesSection {
  @Input() sessions: TrainingSession[] = [];

  constructor(public translationService: TranslationService) {}
}
