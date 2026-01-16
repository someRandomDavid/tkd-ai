import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '@shared/material.module';
import { DownloadableForm } from '@shared/models';

/**
 * Download item component for displaying downloadable forms/documents
 * Features:
 * - Material List Item layout with icon
 * - Shows file name, description, type, and size
 * - Mobile-first design with ≥44px tap targets
 * - Emits download event on click
 */
@Component({
  selector: 'app-download-item',
  imports: [MaterialModule],
  templateUrl: './download-item.html',
  styleUrl: './download-item.scss'
})
export class DownloadItem {
  @Input() form!: DownloadableForm;
  @Output() downloadClick = new EventEmitter<DownloadableForm>();

  onDownload(event: Event): void {
    event.preventDefault();
    this.downloadClick.emit(this.form);
  }

  getFileIcon(): string {
    const fileType = this.form.fileType.toLowerCase();
    if (fileType === 'pdf') return 'picture_as_pdf';
    if (fileType === 'doc' || fileType === 'docx') return 'description';
    return 'insert_drive_file';
  }

  formatFileSize(): string {
    if (!this.form.fileSize) return '';
    const kb = this.form.fileSize / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(0)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  }
}
