export class ExcelCellContent {
    public cellData: any;
    public cellColumn: string;
    public cellRow: string;
    public dataVarReference?: string;
    public mergeCells?: ExcelMergeCells;
    public styles?: any;
    public cellType?: string;
    public rowHeight?: number;
    public belowTableData?: boolean;
}

export class ExcelMergeCells {
    public firstColumn: string;
    public firstRow: number;
    public lastColumn: string;
    public lastRow: number;
}
