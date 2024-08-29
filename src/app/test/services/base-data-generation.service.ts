import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseDataGenerationService {

  public randomNum(max: number): number {
    return Math.floor(Math.random() * max);
  }

  
}
