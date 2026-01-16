import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { TranslationService } from '@core/services/translation.service';
import { ScheduleFilters, FilterProgramType, PROGRAM_TYPE_OPTIONS, DEFAULT_FILTERS, FILTER_STORAGE_KEY } from '@shared/models';

/**
 * Schedule filter component
 * Provides UI controls for filtering training sessions
 */
@Component({
  selector: 'app-schedule-filter',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './schedule-filter.html',
  styleUrl: './schedule-filter.scss',
})
export class ScheduleFilter implements OnInit {
  @Output() filtersChange = new EventEmitter<ScheduleFilters>();

  filters = signal<ScheduleFilters>({ ...DEFAULT_FILTERS });
  programTypeOptions = PROGRAM_TYPE_OPTIONS;

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadFiltersFromStorage();
  }

  onProgramTypeChange(value: FilterProgramType): void {
    this.filters.update(current => ({ ...current, programType: value }));
    this.saveFiltersToStorage();
    this.filtersChange.emit(this.filters());
  }

  onSearchChange(value: string): void {
    this.filters.update(current => ({ ...current, searchText: value }));
    this.saveFiltersToStorage();
    this.filtersChange.emit(this.filters());
  }

  clearFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
    this.clearFiltersFromStorage();
    this.filtersChange.emit(this.filters());
  }

  get hasActiveFilters(): boolean {
    const current = this.filters();
    return current.programType !== 'all' || current.searchText !== '';
  }

  private loadFiltersFromStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const parsedFilters = JSON.parse(saved) as ScheduleFilters;
        // Validate the loaded data
        if (this.isValidFilterData(parsedFilters)) {
          this.filters.set(parsedFilters);
          // Emit the loaded filters to parent component
          this.filtersChange.emit(parsedFilters);
        }
      }
    } catch (error) {
      console.warn('Failed to load filters from localStorage:', error);
    }
  }

  private saveFiltersToStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(this.filters()));
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error);
    }
  }

  private clearFiltersFromStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear filters from localStorage:', error);
    }
  }

  private isValidFilterData(data: any): data is ScheduleFilters {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.searchText === 'string' &&
      (data.programType === 'all' ||
        data.programType === 'taekwondo' ||
        data.programType === 'zumba' ||
        data.programType === 'deepwork')
    );
  }
}
