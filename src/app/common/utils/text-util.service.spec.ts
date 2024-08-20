import { TestBed } from '@angular/core/testing';

import { TextUtilService } from './text-util.service';

describe('TextUtilService', () => {
  let service: TextUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pad a number with leading 0s', () => {
    expect(TextUtilService.pad3(1)).toEqual('001');
    expect(TextUtilService.pad3(12)).toEqual('012');
    expect(TextUtilService.pad3(123)).toEqual('123');
    expect(TextUtilService.pad3(1234)).toEqual('1234');
    expect(TextUtilService.pad2(1)).toEqual('01');
    expect(TextUtilService.pad2(12)).toEqual('12');
    expect(TextUtilService.pad2(123)).toEqual('123');
    expect(TextUtilService.customPad(1, 1)).toEqual('1');
    expect(TextUtilService.customPad(12, 5)).toEqual('00012');
    expect(TextUtilService.customPad(123, 2)).toEqual('123');
  });

  it('should pad a number with leading 0s and cover edge cases', () => {
    expect(TextUtilService.pad3(0)).toEqual('000');
    expect(TextUtilService.pad2(0)).toEqual('00');
    expect(TextUtilService.customPad(0, 2)).toEqual('00');

    expect(TextUtilService.pad3(-1)).toEqual('-1');
    expect(TextUtilService.pad2(-1)).toEqual('-1');
    expect(TextUtilService.customPad(-1, 1)).toEqual('-1');
    expect(TextUtilService.customPad(-12, 5)).toEqual('-00012');
    expect(TextUtilService.customPad(-123, 2)).toEqual('-123');
    
    expect(TextUtilService.pad3(1.5)).toEqual('001');
    expect(TextUtilService.pad2(1.5)).toEqual('01');
    expect(TextUtilService.customPad(1.5, 2)).toEqual('01');
  });

  it('should convert a number to alpha and back', () => {
    const testSingle = 7;
    expect(TextUtilService.convertNumberToAlpha(testSingle)).toEqual('G');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testSingle))).toEqual(testSingle);
    const testDouble = 38;
    expect(TextUtilService.convertNumberToAlpha(testDouble)).toEqual('AL');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testDouble))).toEqual(testDouble);
    const testTriple = 4234;
    expect(TextUtilService.convertNumberToAlpha(testTriple)).toEqual('FFV');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testTriple))).toEqual(testTriple);
    const testQuad = 360692;
    expect(TextUtilService.convertNumberToAlpha(testQuad)).toEqual('TMNT');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testQuad))).toEqual(testQuad);
  });

  it('should convert a number to alpha and back and cover edge cases', () => {
    const testZero = 0;
    expect(TextUtilService.convertNumberToAlpha(testZero)).toEqual('');
    const testZ = 26;
    expect(TextUtilService.convertNumberToAlpha(testZ)).toEqual('Z');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testZ))).toEqual(testZ);
    const testZZ = 702;
    expect(TextUtilService.convertNumberToAlpha(testZZ)).toEqual('ZZ');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testZZ))).toEqual(testZZ);
    const testAAA = 703;
    expect(TextUtilService.convertNumberToAlpha(testAAA)).toEqual('AAA');
    expect(TextUtilService.convertLettersToNumbers(
      TextUtilService.convertNumberToAlpha(testAAA))).toEqual(testAAA);
    expect(TextUtilService.convertLettersToNumbers('2')).toEqual(-1);
    expect(TextUtilService.convertLettersToNumbers(' ')).toEqual(-1);
    expect(TextUtilService.convertLettersToNumbers('a')).toEqual(1);
    expect(TextUtilService.convertLettersToNumbers('z')).toEqual(26);
    expect(TextUtilService.convertLettersToNumbers('aa')).toEqual(27);
    expect(TextUtilService.convertLettersToNumbers('aa ')).toEqual(-1);
  });


});
