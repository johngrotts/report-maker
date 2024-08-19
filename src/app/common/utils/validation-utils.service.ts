import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationUtilsService {

  public static isNullUndefined(object: any): boolean {
    return object === null || object === undefined;
  }

  public static doesExist(object: any): boolean {
    return object !== null && object !== undefined;
  }

  public static doesArrayHaveData(array: any[]): boolean {
    if(array === null || array === undefined) {
      return false;
    } else {
      return array.length > 0;
    }
  }
}
