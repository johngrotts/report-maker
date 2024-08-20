import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ExcelTemplateReaderProperties } from '../models/excel-template-reader-properties';
import { ExcelMergeCells } from '../models/excel-data-content';
import { TextUtilService } from '../../../common/utils/text-util.service';
import { ExcelColumnProperty, ExcelFormatter, ExcelSheetFormatter, ExcelWorksheetFormatter } from '../models/excel-formatter';

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
    const excelFormatter = new ExcelFormatter();

    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(data).then(wb => {
      excelFormatter.sheetFormatters = [];
      wb.eachSheet((sheet, id) => {
        const so = sheet as any;

        // Worksheet Properties
        const sp = new ExcelWorksheetFormatter();
        sp.sheetName = so['name'];
        sp.headerFooter = so.headerFooter;

        // Column Properties
        const cp: ExcelColumnProperty[] = [];
        so.columns.forEach((c: any, i: number) => {
          const col = new ExcelColumnProperty();
          col.column = i + 1;
          col.width = c.width;
          col.styles = c.style;
          cp.push(col);
        });

        // Sheet Properties
        const sf = new ExcelSheetFormatter();
        sf.styles = so['pageSetup'];
        sf.columnProperties = cp;

        // Cell Merges
        const merges = so['_merges']


        if(templateProperties) {
          // Initial Setup

          // Sheet Head Data

          // Table Header and Data

          // Sheet Foot

          // Individual Formulas

          // Conditional Formatting



        } else { // Just extract everything

        }
      });
    });
  }

  protected static createMerge(mergeCell: any): ExcelMergeCells {
    const emc = new ExcelMergeCells();
    emc.firstRow = mergeCell.model.top;
    emc.lastRow = mergeCell.model.bottom;
    emc.firstColumn = TextUtilService.convertNumberToAlpha(mergeCell.model.left);
    emc.lastColumn = TextUtilService.convertNumberToAlpha(mergeCell.model.right);
    return emc;
  }
}
