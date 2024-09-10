import { Injectable } from '@angular/core';

export class TSObjectOptions {
  public isInterface?: boolean;
  public displayInHtml?: boolean;
  public indentSpaces?: number;
  public makeEverythingOptional?: boolean;
}
export class TSObjectClass {
  public className: string;
  public params: Map<string, string[]>;
  public pathToObject: string;
}
export class TSParamInfo {
  public param: string;
  public class: string;
  public pathToParam: string;
  public type: string;
}

@Injectable({
  providedIn: 'root'
})
export class JsonObjectManagementService {

  protected static objects = new WeakMap();
  protected static displayObjects = [];
  protected static tsParams: TSParamInfo[] = []
  protected static tsObjects: Map<string, TSObjectClass> = new Map();

  public static printKeys(value: any, indent: number): string {
    let str = '';
    let spaces = '';
    for (let i = 0; i < indent; i++) {
      spaces = `${spaces}  `;
    }
    if (typeof value === 'object' && value !== null && !(value instanceof Boolean) &&
      !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) &&
      !(value instanceof String)) {
      if (Array.isArray(value)) {
        value.forEach((e, i) => {
          str = `${str}\n${spaces}[${i}]: ${this.printKeys(e, indent + 1)}`;
        });
      } else {
        Object.keys(value).forEach((n: any) => {
          str = `${str}\n${spaces}public ${n}: ${typeof value[n]};${this.printKeys(value[n], indent + 1)}`;
        });
      }
      // console.log('STR: ', str)
      return str;
    }
    return str;
  }

  public static createTSObjectsFromJson(obj: any, objName: string, pathToObj: string): any {
    this.createTSObjects(obj, objName, pathToObj);
    this.cleanupTSObjects();
    return this.tsObjects;
  }

  protected static cleanupTSObjects(): any {
    this.tsParams.forEach((t: TSParamInfo, i: number) => {
      // console.log('T--- ', t)
      if(this.tsObjects.has(t.pathToParam)) {
        const tso = this.tsObjects.get(t.pathToParam);
        if(tso?.params) {
          
        }
        console.log('TSO ', tso)
        
      } else {
        const tso = new TSObjectClass();
        // console.log('NEW: ', t)
        tso.className = t.class;
        tso.pathToObject = t.pathToParam;
        tso.params = new Map();
        tso.params.set(t.param, [t.type]);
        this.tsObjects.set(t.pathToParam, tso);
      }
    });
  }

  protected static createTSObjects(obj: any, objName: string, pathToObj: string): any {
    Object.keys(obj).forEach(o => {
      const tsp = new TSParamInfo();
      tsp.class = objName;
      // console.log('OBJECT: ', o, obj[o])
      if(o !== '$ref') {
        if (typeof obj[o] === 'object' && obj[o] !== null && !(obj[o] instanceof Boolean) &&
        !(obj[o] instanceof Date) && !(obj[o] instanceof Number) && !(obj[o] instanceof RegExp) &&
        !(obj[o] instanceof String)) {
          if (Array.isArray(obj[o])) {
            obj[o].forEach((a: any, i: number) => {
              console.log('ARRAY: ', a, o)
              tsp.param = o;
              tsp.pathToParam = `${pathToObj}[]/${o}`;
              this.tsParams.push(tsp);
              this.createTSObjects(a, o, `${pathToObj}[]/${o}`);
            });
          } else {
            Object.keys(obj[o]).forEach((n: any) => {
              tsp.param = n;
              tsp.pathToParam = `${pathToObj}/${n}`;
              tsp.type = typeof n;
              // console.log('OBJECT: ', n, obj[o][n])
              this.createTSObjects(obj[o], n, `${pathToObj}/${n}`);
            });
          }
        } else if(o !== '$ref') {
          tsp.param = o;
          tsp.type = typeof o;
          tsp.pathToParam = `${pathToObj}/`;
          this.tsParams.push(tsp);
        }
      }
      
    });
  }

  public static decycleJson(object: any, maxDepth?: number): any {
    return this.derez(object, '$', 0, maxDepth ?? 15);
  }
  protected static derez(value: any, path: string, currentDepth: number, maxDepth: number): any {
    let oldPath;
    let newObj;
    if (typeof value === 'object' && value !== null && !(value instanceof Boolean) &&
      !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) &&
      !(value instanceof String)) {
      oldPath = this.objects.get(value);
      if (oldPath !== undefined) {
        return { $ref: oldPath };
      }
      this.objects.set(value, path);
      if (Array.isArray(value)) {
        newObj = [];
        value.forEach((e, i) => {
          if (currentDepth >= maxDepth) {
            newObj[i] = 'CIRCULAR';
          } else {
            newObj[i] = this.derez(e, `${path}[${i}]`, currentDepth + 1, maxDepth);
          }
        });
      } else {
        newObj = {};
        Object.keys(value).forEach((n: any) => {
          if (currentDepth >= maxDepth) {
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
