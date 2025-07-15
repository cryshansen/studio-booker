import { Injectable } from '@angular/core';


export interface PrefillData{
  fullname?:string;
  email?:string;
  subject?:string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactPrefillService {


  private prefillData: PrefillData = {};

  setPrefill(data: { [key:string] : string }) {
   
    this.prefillData = {...this.prefillData, ...data };

  }
  getPrefill(){
    return this.prefillData;
  }

  clear() {
    this.prefillData={};
  }
}
