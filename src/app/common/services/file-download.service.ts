import { Injectable } from '@angular/core';
import { DownloadObject } from '../models/download-object';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  public static downloadFile(file: DownloadObject): void {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file.file);
    element.download = file.filename;
    document.body.appendChild(element);
    element.click();
  };
  
}
