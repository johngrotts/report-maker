import { Component } from '@angular/core';
import { ExcelReaderService } from '../../report-maker/excel/services/excel-reader.service';
import { ExcelTemplateReaderProperties } from '../../report-maker/excel/models/excel-template-reader-properties';
import { JsonParserService, PrettifiedJsonParams } from '../../common/utils/json-parser.service';

@Component({
  selector: 'app-ui-test',
  standalone: true,
  imports: [],
  templateUrl: './ui-test.component.html',
  styleUrl: './ui-test.component.css'
})
export class UiTestComponent {

  public htmlToDisplay = '';

  public readXLSX() {
    const pp = new PrettifiedJsonParams();
    pp.forHtml = true;
    pp.spacesMultiplier = 2;
    const tp = new ExcelTemplateReaderProperties();
    tp.sheetHeadStartRow = 1;
    tp.sheetHeadEndRow = 4;
    tp.tableHeaderStartRow = 6;
    tp.tableHeaderEndRow = 6;
    tp.tableDataStartRow = 7;
    tp.sheetFootStartRow = 9;
    tp.sheetFootEndRow = 11;
    const ef = ExcelReaderService.readXLSXFromFilePath(
      'http://localhost:4200/assets/basic-excel-test-1.xlsx', tp
    ).then(res => {
      this.htmlToDisplay = JsonParserService.parseAndPrettifyJson(JSON.parse(JSON.stringify(res)), pp);
    }).catch(e => {
      console.log('ERROR IN PARSING XLSX: ', e);
    });
  }

  public readXLSXData() {
    const pp = new PrettifiedJsonParams();
    pp.forHtml = true;
    pp.spacesMultiplier = 2;
    const tp = new ExcelTemplateReaderProperties();
    tp.sheetHeadStartRow = 1;
    tp.sheetHeadEndRow = 4;
    tp.tableHeaderStartRow = 6;
    tp.tableHeaderEndRow = 6;
    tp.tableDataStartRow = 7;
    tp.sheetFootStartRow = 9;
    tp.sheetFootEndRow = 11;
    const ef = ExcelReaderService.readXLSXData(
      'http://localhost:4200/assets/basic-excel-test-1.xlsx', tp
    ).then(res => {
      this.htmlToDisplay = JsonParserService.parseAndPrettifyJson(JSON.parse(JSON.stringify(res)), pp);
    }).catch(e => {
      console.log('ERROR IN PARSING XLSX: ', e);
    });
  }

  public createXLSX() {
    
  }
}
