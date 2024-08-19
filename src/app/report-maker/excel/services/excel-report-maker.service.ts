import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ExcelConditionalFormats, ExcelContentFormatter, ExcelFootFormatter, ExcelHeadFormatter, ExcelIndividualFormulaCell, ExcelSheetFormatter } from '../models/excel-formatter';
import { ValidationUtilsService } from '../../../common/utils/validation-utils.service';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelReportMakerService {

  protected static dataFirstRow: number;
  protected static dataLastRow: number = 1;
  protected static emptyRowsBetweenTableAndFoot: number = 0;
  

  protected static setSheetProperties(workbook: ExcelJS.Workbook, sheetNumber: number, 
                                      data: any, sheetProperties: ExcelSheetFormatter): void {
    const sheet = workbook.worksheets[sheetNumber];
    sheet.pageSetup = sheetProperties.styles ?? {};
    sheetProperties.columnProperties?.forEach(c => {
      sheet.getColumn(c.column).style = c.styles ?? {};
      if(ValidationUtilsService.doesExist(c.width)) {
        sheet.getColumn(c.column).width = c.width;
      }
    })
  }

  protected static generateContent(workbook: ExcelJS.Workbook, sheetNumber: number, 
                                   data: any, content: ExcelContentFormatter): void {
    const sheet = workbook.worksheets[sheetNumber];
    let currentRow = content.headerStartingRow ?? sheet.lastRow!.number + 1;

    // Add Table Headers
    const tableHeadersAndFormats = content.tableHeaderData;
    let hasConditionalFormats = false;
    let contentConditionalFormats: KeyValue<string, ExcelConditionalFormats[]>[] = [];
    if(ValidationUtilsService.doesExist(tableHeadersAndFormats)) {
      content.tableHeaderData?.forEach(h => {
        const cell = sheet.getCell(`${h.column}:${currentRow}`);
        cell.style = h.headerStyles;
        cell.value = h.headerTitle;
        if(ValidationUtilsService.doesExist(h.conditionalFormats)) {
          hasConditionalFormats = true;
          contentConditionalFormats.push({key: h.column, value: h.conditionalFormats!});
        }
      });
      currentRow = content.dataStartingRow ?? sheet.lastRow!.number + 1;

      // Set Table Data
      this.dataFirstRow = currentRow;
      const tableData = data['data'];
      if(ValidationUtilsService.doesExist(tableData)) {
        tableData.forEach((d: any) => {
          tableHeadersAndFormats?.forEach(hf => {
            const cell = sheet.getCell(`${hf.column}:${currentRow}`);
            cell.style = hf.dataStyles;
            if(ValidationUtilsService.doesExist(hf.dataCellType) && hf.dataCellType?.toUpperCase() === 'NUMBER') {
              cell.value = Number(d[hf.dataKey]);
            } else {
              cell.value = d[hf.dataKey];
            }
          });
          currentRow++;
        });
      } else {
        sheet.addRow(content.noDataFoundMessage ?? 'NO DATA FOUND');
      }
      this.dataLastRow = currentRow - 1;

      // Set Conditional Formats
      if(hasConditionalFormats) {
        const conditionalFormats: ExcelConditionalFormats[] = [];
        contentConditionalFormats.forEach(cf => {
          cf.value.forEach(f => {
            f.ref = `${cf.key}${this.dataFirstRow}:${cf.key}${this.dataLastRow}`;
            conditionalFormats.push(f);
          });
        });
        this.generateConditionalFormatting(workbook, sheetNumber, conditionalFormats);
      }
    }

  }  

  protected static generateSheetHead(workbook: ExcelJS.Workbook, sheetNumber: number, 
                                     data: any, headContent: ExcelHeadFormatter): void {
    const sheet = workbook.worksheets[sheetNumber];
    headContent.cellContents.forEach(c => {
      const cell = sheet.getCell(`${c.cellColumn}${c.cellRow}`);
      cell.style = c.styles ?? '';
      let cellText: string = c.cellData;
      if(cellText.toLowerCase().includes('%v') &&
        ValidationUtilsService.doesExist(c.dataVarReference) &&
        ValidationUtilsService.doesExist(data[c.dataVarReference!]) ) {
          cellText = cellText.replace('%v', data[c.dataVarReference!] ?? '');
        }
      if(ValidationUtilsService.doesExist(c.cellType) && c.cellType?.toUpperCase() === 'NUMBER') {
        cell.value = Number(cellText);
      } else {
        cell.value = cellText;
      }
      const row = sheet.getRow(Number(cell.row));
      if(ValidationUtilsService.doesExist(c.rowHeight) && ValidationUtilsService.doesExist(row)) {
        row.height = c.rowHeight!;
      }
      if(c.mergeCells) {
        const firstCell = `${c.mergeCells.firstColumn}${c.mergeCells.firstRow}`;
        const lastCell = `${c.mergeCells.lastColumn}${c.mergeCells.lastRow}`;
        sheet.mergeCells(`${firstCell};${lastCell}`);
      }
    });

    // Add empty rows between head and table
    if(ValidationUtilsService.doesExist(headContent.emptyRowsBelowThisSection)) {
      for(let i = 0; i < headContent.emptyRowsBelowThisSection!; i++) {
        sheet.addRow('');
      }
    }
  }


  
  protected static generateSheetFoot(workbook: ExcelJS.Workbook, sheetNumber: number, 
                                     data: any, footContent: ExcelFootFormatter): void {
    const sheet = workbook.worksheets[sheetNumber];
    let rowsFromPreviousSection = sheet.lastRow!.number + 1;
    if(ValidationUtilsService.doesExist(footContent.emptyRowsAboveThisSection)) {
      this.emptyRowsBetweenTableAndFoot = footContent.emptyRowsAboveThisSection!;
      rowsFromPreviousSection = rowsFromPreviousSection + this.emptyRowsBetweenTableAndFoot;
    }
    footContent.cellContents.forEach(c => {
      const cell = sheet.getCell(`${c.cellColumn}${c.cellRow + rowsFromPreviousSection}`);
      cell.style = c.styles ?? '';
      let cellText: string = c.cellData;
      if(cellText.toLowerCase().includes('%v') &&
        ValidationUtilsService.doesExist(c.dataVarReference) &&
        ValidationUtilsService.doesExist(data[c.dataVarReference!]) ) {
          cellText = cellText.replace('%v', data[c.dataVarReference!] ?? '');
        }
      if(ValidationUtilsService.doesExist(c.cellType) && c.cellType?.toUpperCase() === 'NUMBER') {
        cell.value = Number(cellText);
      } else {
        cell.value = cellText;
      }
      const row = sheet.getRow(Number(cell.row));
      if(ValidationUtilsService.doesExist(c.rowHeight) && ValidationUtilsService.doesExist(row)) {
        row.height = c.rowHeight!;
      }
      if(c.mergeCells) {
        const firstCell = `${c.mergeCells.firstColumn}${c.mergeCells.firstRow + rowsFromPreviousSection}`;
        const lastCell = `${c.mergeCells.lastColumn}${c.mergeCells.lastRow + rowsFromPreviousSection}`;
        sheet.mergeCells(`${firstCell};${lastCell}`);
      }
    });
  }

  protected static generateIndividualFormulaCells(workbook: ExcelJS.Workbook, sheetNumber: number, data: any, 
                                                  formulaCells: ExcelIndividualFormulaCell): void {
    const sheet = workbook.worksheets[sheetNumber];
    formulaCells.cellContents.forEach(f => {
      const rowsFromBottomOfTable = f.belowTableData ? this.emptyRowsBetweenTableAndFoot + this.dataLastRow : 0;
      const cell = sheet.getCell(`${f.cellColumn}${f.cellRow + rowsFromBottomOfTable}`);
      const cellText = f.cellData.replace('${dataFirstRow}', this.dataFirstRow).replace('${dataLastRow}', this.dataFirstRow);
      cell.value = {formula: cellText};
      cell.style = f.styles ?? '';
      
      if(f.mergeCells) {
        const firstCell = `${f.mergeCells.firstColumn}${f.mergeCells.firstRow + rowsFromBottomOfTable}`;
        const lastCell = `${f.mergeCells.lastColumn}${f.mergeCells.lastRow + rowsFromBottomOfTable}`;
        sheet.mergeCells(`${firstCell};${lastCell}`);
      }
    });
  }

  protected static generateConditionalFormatting(workbook: ExcelJS.Workbook, sheetNumber: number,
                                                 conditionalFormats: ExcelConditionalFormats[]): void {
    const sheet = workbook.worksheets[sheetNumber];
    conditionalFormats.forEach(c => {
      let formula = {...c};
      sheet.addConditionalFormatting(formula);
    });
  }

}
