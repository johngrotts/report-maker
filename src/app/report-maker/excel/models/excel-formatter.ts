import { KeyValue } from "@angular/common";
import { ExcelCellContent } from "./excel-data-content";

export class ExcelFormatter {
    public reportName: string;
    public fileName: string;
    public id?: number;
    public reportInformation?: KeyValue<string, any>[];
    public sheetFormatters: ExcelWorksheetFormatter[];
}

export class ExcelWorksheetFormatter {
    public sheetName?: string;
    public sheetFormatter?: ExcelSheetFormatter;
    public headFormatter?: ExcelHeadFormatter;
    public contentFormatter?: ExcelContentFormatter;
    public footFormatter?: ExcelFootFormatter;
    public individualFormulaCells?: ExcelIndividualFormulaCell;
    public conditionalFormats?: ExcelConditionalFormats[];
    public headerFooter?: any;
}

export class ExcelSheetFormatter {
    public styles?: any;
    public columnProperties?: ExcelColumnProperty[];
}

export class ExcelColumnProperty {
    public column: string | number;
    public width?: number;
    public styles?: any;
}

export class ExcelHeadFootFormatter {
    public cellContents: ExcelCellContent[];
}

export class ExcelHeadFormatter extends ExcelHeadFootFormatter {
    public emptyRowsBelowThisSection?: number;
}

export class ExcelFootFormatter extends ExcelHeadFootFormatter {
    public emptyRowsAboveThisSection?: number;
}

export class ExcelContentFormatter {
    public tableHeaderData: ExcelTableHeaderDataFormatter[];
    public headerStartingRow: number;
    public dataStartingRow: number;
    public tableHeaderRowStyles?: any;
    public noDataFoundMessage?: string;
    public noDataFoundStyles?: any;
}

export class ExcelTableHeaderDataFormatter {
    public headerTitle: string;
    public dataKey: string;
    public column: string;
    public headerStyles?: any;
    public dataStyles?: any;
    public dataCellType?: string;
    public conditionalFormats?: any[];
}

export class ExcelIndividualFormulaCell extends ExcelHeadFootFormatter {

}

export class ExcelConditionalFormats {
    public ref: string;
    public rules: any[];
}
