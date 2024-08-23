import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ExcelTemplateReaderCellMerge, ExcelTemplateReaderProperties } from '../models/excel-template-reader-properties';
import { ExcelCellContent, ExcelMergeCells } from '../models/excel-data-content';
import { TextUtilService } from '../../../common/utils/text-util.service';
import { ExcelColumnProperty, ExcelContentFormatter, ExcelFormatter, ExcelHeadFormatter, ExcelSheetFormatter, ExcelTableHeaderDataFormatter, ExcelWorksheetFormatter } from '../models/excel-formatter';
import { ValidationUtilsService } from '../../../common/utils/validation-utils.service';

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
        const merges = so['_merges'];
        const cellMerges: ExcelTemplateReaderCellMerge[] = [];
        Object.keys(merges).forEach((m: any) => {
          let col = m.replace(/[^a-z]/gi, '');
          let row = m.replace(/\D/g, '');
          cellMerges.push({ cell: m, col: col, row: row, model: merges[m].model });
        });
        cellMerges.sort((a, b) => {
          const cellA = `${a.col}${TextUtilService.pad3(a.row)}`;
          const cellB = `${b.col}${TextUtilService.pad3(b.row)}`;
          if(cellA < cellB) {
            return -1;
          }
          if(cellA > cellB) {
            return 1;
          }
          return 0;
        });


        if(templateProperties) {
          // Initial Setup
          const headStart = templateProperties.sheetHeadStartRow ? templateProperties.sheetHeadStartRow : 1;
          const headEnd = templateProperties.sheetHeadEndRow ? templateProperties.sheetHeadEndRow : 1;
          const headRange = headEnd - headStart + 1;
          const tableHeaderStart = templateProperties.tableHeaderStartRow ? templateProperties.tableHeaderStartRow : 1;
          const tableHeaderEnd = templateProperties.tableHeaderEndRow ? templateProperties.tableHeaderEndRow : 1;
          const tableHeaderRange = tableHeaderEnd - tableHeaderStart + 1;
          const tableDataStartRow = templateProperties.tableDataStartRow ? templateProperties.tableDataStartRow : 1;
          const footStart = templateProperties.sheetFootStartRow ? templateProperties.sheetFootStartRow : 1;
          const footEnd = templateProperties.sheetFootEndRow ? templateProperties.sheetFootEndRow : 1;
          const footRange = footEnd - footStart + 1;
          const individualFormulaCells: any[] = [];

          // Sheet Head Data
          const headFormatter = new ExcelHeadFormatter();
          headFormatter.emptyRowsBelowThisSection = tableHeaderStart - headEnd - 1;
          if(headRange > 0) {
            headFormatter.cellContents = [];
            for(let i = 1; i <= headRange; i++) {
              so.getRow(i)['_cells'].forEach((c: any) => {
                const cell = new ExcelCellContent();
                let cellVal = c._value.model.value;

                if(ValidationUtilsService.doesExist(cellVal)) {
                  let varRef = cellVal as string;
                  const varStart = varRef.search( /(?<!\\)(\${)/ );
                  if(varStart >= 0) {
                    const varEnd = varRef.substring(varStart).search( /}/ ) + varStart;
                    cell.dataVarReference = varRef;
                    cellVal = `${cellVal.substring(0, varStart)}%v${cellVal.substring(varEnd + 1)}`;
                  }
                }
                if(ValidationUtilsService.doesExist(cellVal) || ValidationUtilsService.doesExist(c._value.model.style) ) {
                  if(ValidationUtilsService.doesExist(c._value.model.formula)) {
                    individualFormulaCells.push(c);
                  } else {
                    cell.cellData = cellVal;
                    cell.cellType = c._value.model.type;
                    cell.styles = c._value.model.style;
                    cell.cellColumn = c._value.model.address.replace(/[^a-z]/gi, '');
                    cell.cellRow = c._value.model.address.replace(/\D/g, '');
                    const mCell = cellMerges.find(m => m.cell === `${cell.cellColumn}${cell.cellRow}`);
                    if(ValidationUtilsService.doesExist(mCell)) {
                      cell.mergeCells = this.createMerge(mCell);
                    }
                    headFormatter.cellContents.push(cell);
                  }
                }
              });
            }
            sp.headFormatter = headFormatter;
          }

          // Table Headers and Data
          const cf = new ExcelContentFormatter();
          const had: ExcelTableHeaderDataFormatter[] = [];
          if(tableHeaderRange > 0 && tableDataStartRow > 0) {
            cf.headerStartingRow = tableHeaderStart;
            cf.dataStartingRow = tableDataStartRow;
            for(let i = tableHeaderStart; i <= tableHeaderEnd; i++) {
              so.getRow(i)._cells.forEach((c: any) => {
                const thd = new ExcelTableHeaderDataFormatter();
                thd.headerTitle = c._value.model.value;
                thd.headerStyles = c._value.model.style;
                thd.column = c._value.model.address.replace(/[^a-z]/gi, '');
                const dc = so.getCell(`${thd.column}${tableDataStartRow}`);
                if(dc._value.model.value) {
                  thd.dataKey = dc._value.model.value;
                } else if(ValidationUtilsService.doesExist(dc._value.model.formula)) {
                  thd.dataKey = `=${dc._value.model.formula}`;
                }
                thd.dataCellType = dc._value.model.type;
                thd.dataStyles = dc._value.model.style;
                had.push(thd);
              });
            }
            cf.tableHeaderData = had;
            sp.contentFormatter = cf;
          }

          // Sheet Foot


          // Individual Formulas


          // Conditional Formatting
          sp.conditionalFormats = so['conditionalFormattings'];


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
