import { Component, Input } from '@angular/core';
import { MaterialModule } from '@shared/material.module';
import { DownloadItem } from '@app/shared/components/download-item/download-item';
import { DownloadableForm } from '@shared/models';

/**
 * Downloads section component displaying downloadable forms
 * Features:
 * - Grid layout (2 columns desktop, 1 column mobile)
 * - Section anchor for navigation
 * - Handles download actions
 */
@Component({
  selector: 'app-downloads-section',
  imports: [MaterialModule, DownloadItem],
  templateUrl: './downloads-section.html',
  styleUrl: './downloads-section.scss'
})
export class DownloadsSection {
  @Input() forms: DownloadableForm[] = [];

  onDownload(form: DownloadableForm): void {
    // Open PDF in new tab
    window.open(form.fileUrl, '_blank');
  }
}
