import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { BaseDataGenerationService } from './base-data-generation.service';
import { PdfMakeDataModel1 } from '../models/pdfmake-data-models';
import { TextUtilService } from '../../common/utils/text-util.service';

@Injectable({
  providedIn: 'root'
})
export class PdfmakeDataGeneratorService extends BaseDataGenerationService {

  constructor() {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
    super();
  }
  public createBasicPdfData1(entries: number): void {
    const data: PdfMakeDataModel1[] = [];
    for(let i = 0; i < entries; i++) {
      const d = new PdfMakeDataModel1();
      d.id = i;
      d.name = `Name${TextUtilService.customPad(i, 4)}`;
      d.startingBalance = (this.randomNum(15) + 1) * 100000;
      d.monthlyPayment = (this.randomNum(15) + 1) * 100;
      d.paymentsMade = this.randomNum(20);
      d.paymentsMissed = this.randomNum(5);
      d.gainLoss = (d.monthlyPayment * d.paymentsMade) - (d.paymentsMissed * 50);
      d.startingBalance = d.startingBalance - d.gainLoss;
    }

  }
}
