import { Injectable } from '@angular/core';

export class PrettifiedJsonParams {
  public spacesMultiplier?: number;
  public forHtml?: boolean;
  public lineBreak?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JsonParserService {

  public static isValidJson(json: string) {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static parseAndPrettifyJson(json: JSON, pp: PrettifiedJsonParams): string {
    
    let display = '';
    const j = json as any;
    if(!this.isValidJson(JSON.stringify(json))) {
      return `{ "error": true, "message": "The JSON you submitted is invalid" }`;
    }
    let jsonType = '';
    if(JSON.stringify(json).trim().startsWith('[')) {
      jsonType = 'ARRAY';
    } else if(JSON.stringify(json).trim().startsWith('{')) {
      jsonType = 'OBJECT';
    } else {
      return `{ "error": true, "message": "The JSON you submitted is invalid" }`;
    }
    if(pp.lineBreak === null || pp.lineBreak === undefined) {
      pp.lineBreak = `\n`;
    }
    if(pp.forHtml) {
      pp.lineBreak = `<br />\n`;
    }
    const endChar = jsonType === 'OBJECT' ? '}' : ']';
    const beginChar = jsonType === 'ARRAY' ? `${this.addCharBreak('[', pp)}` : `${this.addCharBreak('{', pp)}`;
    display = `${beginChar}${this.parseAndPrettify(j, 1, pp, false, jsonType === 'ARRAY')}${endChar}`;
    return display;
  }



  protected static parseAndPrettify(json: any, currentIndent: number,  pp: PrettifiedJsonParams, isLast: boolean, insideArray: boolean): string {
    let display = '';

    // console.log('JSON: ', json, Object.keys(json), insideArray)
    Object.keys(json).forEach((j: any, index0: number) => {
      const isLast0 = index0 + 1 === Object.entries(json).length;
      // ARRAY
      if(json[j] !== null && this.isObject(json[j]) && this.isArray(json[j])) {
        // console.log('ARRAY', json[j], insideArray);
        display = `${display}${this.createArray(json[j], j, currentIndent, pp, isLast0, insideArray)}`;

      // OBJECT
      } else if(json[j] !== null && this.isObject(json[j])) {
        // console.log('OBJECT', json[j], insideArray);
        display = `${display}${this.createObject(json[j], j, currentIndent, pp, isLast0, insideArray)}`;
  
      // BASIC VALUE
      } else if(json[j] === null || json[j] === undefined || this.isNumber(json[j]) || this.isBoolean(json[j]) || this.isString(json[j])) {
        // console.log('BASIC VALUE', json[j], insideArray);
        const key = insideArray ? '' : `${this.createKey(j)}`;
        const value = `${this.createBasicValue(json[j])}${this.addCommaUnlessLast(isLast0)}${pp.lineBreak}`;
        display = `${display}${this.createLeadSpaces(currentIndent, pp)}${key}${value}`;
  
      } else {
        console.log('--- ERROR: Unable to determine what this is ---', j)
      }
    });

    
    return display;
  }

  protected static createArray(json: any, jKey: string, currentIndent: number, pp: PrettifiedJsonParams, isLast: boolean, insideArray: boolean): string {
    // Var Setup
    let key = '';
    let value = '';
    let close = `${this.createLeadSpaces(currentIndent, pp)}]${this.addCommaUnlessLast(isLast)}${pp.lineBreak}`;

    // If this is inside an array, a key will not be created
    if(insideArray) {
      key = `${this.createLeadSpaces(currentIndent, pp)}${this.addCharBreak('[', pp)}`
    } else {
      key = `${this.createLeadSpaces(currentIndent, pp)}${this.createKey(jKey)}${this.addCharBreak('[', pp)}`;
    }
    value = this.parseAndPrettify(json, currentIndent + 1, pp, isLast, true);
    
    return `${key}${value}${close}`;
  }

  protected static createObject(json: any, jKey: string, currentIndent: number, pp: PrettifiedJsonParams, isLast: boolean, insideArray: boolean): string {
    // Var Setup
    let key = '';
    let value = '';
    let close = `${this.createLeadSpaces(currentIndent, pp)}}${this.addCommaUnlessLast(isLast)}${pp.lineBreak}`;

    // May (normal object) or may not (directly in array) have a key 
    if(insideArray) {
      key = `${this.createLeadSpaces(currentIndent, pp)}${this.addCharBreak('{', pp)}`
    } else {
      key = `${this.createLeadSpaces(currentIndent, pp)}${this.createKey(jKey)}${this.addCharBreak('{', pp)}`;
    }
    value = this.parseAndPrettify(json, currentIndent + 1, pp, isLast, false);
    
    return `${key}${value}${close}`;
  }

  protected static createKey(keyName: string): string {
    return `"${keyName}": `;
  }

  protected static createBasicValue(value: any): string {
    let val = '';
    if(value === null) {
      val = 'null';
    } else if(value === undefined) {
      val = 'undefined';
    } else if(this.isNumber(value) || this.isBoolean(value) || this.isBoolean(value)) {
      val = value;
    } else if(this.isString(value)) {
      value = (value as string).replaceAll('\\', '\\\\');
      value = (value as string).replaceAll('"', '\\"');
      value = (value as string).replaceAll('\r', '\\r');
      value = (value as string).replaceAll('\n', '\\n');
      value = (value as string).replaceAll('\t', '\\t');
      value = (value as string).replaceAll('\f', '\\f');
      value = (value as string).replaceAll('\b', '\\b');
      val = `"${value}"`;
    } else {
      console.log('--- ERROR: Unable to determine type of value ---', value);
    }
    return val;
  }

  protected static addCharBreak(char: string, pp: PrettifiedJsonParams): string {
    return `${char}${pp.lineBreak}`;
  }

  protected static addCharCommaBreak(char: string, pp: PrettifiedJsonParams, isLast: boolean): string {
    return isLast ? `${char}${pp.lineBreak}` : `${char},${pp.lineBreak}`;
  }

  protected static createLeadSpaces(spacesToAdd: number, pp: PrettifiedJsonParams): string {
    let spaceChar = pp.forHtml ? '\u00A0' : ' ';
    let spaces = '';
    if(spacesToAdd <= 0) {
      return spaces;
    }
    let multiplier = 1;
    if(pp.spacesMultiplier && pp.spacesMultiplier > 0) {
      multiplier = pp.spacesMultiplier;
    }
    for(let i = 0; i < spacesToAdd * multiplier; i++) {
      spaces = `${spaces}${spaceChar}`;
    }
    return spaces;
  }

  protected static addCommaUnlessLast(isLast: boolean): string {
    return isLast? '' : `,`;
  }


  protected static isObject(obj: any): boolean {
    return typeof obj === 'object';
  }

  protected static isArray(arr: any): boolean {
    return Array.isArray(arr);
  }

  /**
   * Returns if an object is a boolean.
   * DOES NOT return the bool itself
   * @param bool 
   * @returns 
   */
  protected static isBoolean(bool: any): boolean {
    return typeof bool === 'boolean';
  }

  protected static isNumber(num: any): boolean {
    return typeof num === 'number';
    // if type of number: return true
    // if not type of string: return false
    // return !isNaN(Number(num)) && !isNaN(parseFloat(num));
  }

  protected static isString(str: any): boolean {
    return typeof str === 'string';
  }
}
