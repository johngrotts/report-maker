import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextUtilService {

  /**
   * Pads a 1 or 2 digit positive whole number with leading zero (if needed)
   * @param num 
   * @returns 
   */
  public static pad2(num: number): string {
    num = Math.floor(num);
    if(num < 10 && num >= 0) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  }

  /**
   * Pads a 1, 2, or 3 digit positive whole number with leading zeros (if needed)
   * @param num 
   * @returns 
   */
  public static pad3(num: number): string {
    num = Math.floor(num);
    if(num < 10 && num >= 0) {
      return `00${num}`;
    } else if(num < 100 && num >= 0) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  }
  
  /**
   * Pads a whole number with leading zeros to a desired length. This can be a positive of negative number
   * customPad(2, 5) should return 00002
   * customPad(-45, 3) should return -045
   * customPad(123, 2) should return 123
   * @param num number to pad digits
   * @param desiredDigits number of places the digit should go to, not including negative sign
   * @returns 
   */
  public static customPad(num: number, desiredDigits: number): string {
    const isNegative = num < 0;
    let n = isNegative ? num * -1 : num;
    n = Math.floor(n);
    let numString = `${n}`;
    const numLength = `${n}`.length;
    if(numLength < desiredDigits) {
      let zeros = '';
      const leading = desiredDigits - numLength;
      for(let i = 0; i < leading; i++) {
        zeros = `0${zeros}`;
      }
      numString = `${zeros}${numString}`;
    }
    if(isNegative) {
      numString = `-${numString}`;
    }
    return numString;
  }

  /**
   * Converts a number into a captial letter representation
   * 1 = A, 2 = B, 27 = AA, 28 = AB, etc.
   * @param num 
   * @returns 
   */
  public static convertNumberToAlpha(num: number): string {
    if(num < 1) {
      return '';
    }
    let mod = num % 26;
    let pow = num / 26 | 0;
    let out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z');
    return pow ? this.convertNumberToAlpha(pow) + out : out;
  }

  /**
   * Converts a string into numbers.
   * This will first convert letters to uppercase, then change them to numbers.
   * A = 1, a = 1, AA = 27, aa = 27
   * If there is any chars that are not letters, this will return -1
   * ' ', 123, !@# all return -1
   * @param str 
   * @returns 
   */
  public static convertLettersToNumbers(str: string): number {
    str = str.toUpperCase();
    if(!(/^[A-Z]+$/.test(str))) {
      return -1;
    }
    let out = 0;
    let len = str.length;
    let pos = len;
    while ((pos -= 1) > -1) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
  }
}
