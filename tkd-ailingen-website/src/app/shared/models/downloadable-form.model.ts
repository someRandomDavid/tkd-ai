/**
 * Downloadable form model
 * Represents registration forms and documents available for download
 */

export type FormCategory = 'membership' | 'events' | 'general';

export interface DownloadableForm {
  id: string;
  formName: string;
  description: string;
  fileUrl: string; // Relative path: "/assets/forms/..."
  fileType: 'pdf';
  fileSize: number; // Size in bytes
  category: FormCategory;
  lastUpdated: string; // ISO 8601 date
  requiredFor?: string;
}

export interface DownloadsCollection {
  forms: DownloadableForm[];
}
