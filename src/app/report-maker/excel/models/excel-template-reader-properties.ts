export class ExcelTemplateReaderProperties {
    public sheetHeadStartRow?: number;
    public sheetHeadEndRow?: number;
    public tableHeaderStartRow?: number;
    public tableHeaderEndRow?: number;
    public tableDataStartRow?: number;
    public sheetFootStartRow?: number;
    public sheetFootEndRow?: number;
}

export class ExcelTemplateReaderCellMerge {
    public cell: string;
    public col: string;
    public row: number;
    public model: any;
}

export class ExcelRangeTemplateReaderProperties extends ExcelTemplateReaderProperties {
    public headRange?: number;
    public tableHeadRange?: number;
    public footRange?: number;
}
