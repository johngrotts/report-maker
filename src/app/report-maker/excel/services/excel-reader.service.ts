import { Injectable } from '@angular/core';
import { ExcelTemplateReaderProperties } from '../models/excel-template-reader-properties';

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {

  protected static async loadExcelFile(fileLocation: string, fileName: string): Promise<File> {
    const response = await fetch(fileLocation);
    const blob = await response.blob();
    return new File([blob], fileName);
  }

  protected static readFile(fileToUpload: File, callback: any): void {
    const reader = new FileReader();
    let data;
    reader.onload = function () {
      data = reader.result;
      callback(data);
    }
    reader.readAsArrayBuffer(fileToUpload);
  }

  protected static readDataFromFile(data: any, templateProperties?: ExcelTemplateReaderProperties): void {
    
  }
}
