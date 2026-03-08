import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  
  downloadBlobAsFile(blob: Blob, filename: string): void {
    // URL temportal
    const fileUrl = window.URL.createObjectURL(blob);

    // Elemento <a> invisible
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(fileUrl);
  }
}
