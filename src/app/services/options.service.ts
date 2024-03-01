import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private optionSource = new BehaviorSubject<any>(null)
  currentOption = this.optionSource.asObservable()

  changeOption(options: any){
    this.optionSource.next(options)
  }
}
