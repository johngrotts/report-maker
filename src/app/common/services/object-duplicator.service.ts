import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectDuplicatorService {

  protected static objects = new WeakMap();

  public static printKeys(value: any, indent: number): string {
    let str = '';
    let spaces = '';
    for(let i = 0; i < indent; i++) {
      spaces = `${spaces}  `;
    }
    if(typeof value === 'object' && value !== null && !(value instanceof Boolean) &&
      !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) &&
      !(value instanceof String) ) {
      if(Array.isArray(value)) {
        value.forEach((e, i) => {
          str = `${str}\n${spaces}[${i}]: ${this.printKeys(e, indent + 1)}`;
        });
      } else {
        Object.keys(value).forEach((n: any) => {
          str = `${str}\n${spaces}public ${n}: ${typeof value[n]};${this.printKeys(value[n], indent + 1)}`;
        });
      }
      console.log('STR: ', str)
      return str;
    }
    return str;
  }

  public static decycleJson(object: any, maxDepth?: number): any {
    return this.derez(object, '$', 0, maxDepth ?? 15);
  }
  protected static derez(value: any, path: string, currentDepth: number, maxDepth: number): any {
    let oldPath;
    let newObj;
    if(typeof value === 'object' && value !== null && !(value instanceof Boolean) &&
    !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) &&
    !(value instanceof String) ) {
      oldPath = this.objects.get(value);
      if(oldPath !== undefined) {
        return {$ref: oldPath};
      }
      this.objects.set(value, path);
      if(Array.isArray(value)) {
        newObj = [];
        value.forEach((e, i) => {
          if(currentDepth >= maxDepth) {
            newObj[i] = 'CIRCULAR';
          } else {
            newObj[i] = this.derez(e, `${path}[${i}]`, currentDepth + 1, maxDepth);
          }
        });
      } else {
        newObj = {};
        Object.keys(value).forEach((n: any) => {
          if(currentDepth >= maxDepth) {
            newObj[n] = 'CIRCULAR';
          } else {
            newObj[n] = this.derez(value[n], `${path}[${JSON.stringify(n)}]`, currentDepth + 1, maxDepth);
          }
        });
      }
      return newObj;
    }
    return value;
  }

}
