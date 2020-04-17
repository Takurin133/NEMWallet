import { Injectable } from '@angular/core';

export interface IAccount {
  multisigPublicKey: string;
  initiatorPrivateKey: string;
  parentTel: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() { }

  getAccount(): IAccount {
    if ('account' in localStorage) {
      return JSON.parse(localStorage.account);
    }
    return null;
  }

  saveAccount(account: IAccount) {
    localStorage.account = JSON.stringify(account);
  }
}
