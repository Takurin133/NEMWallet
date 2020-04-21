import { Injectable } from '@angular/core';

export interface IAccount {
  multisigPublicKey: string;
  initiatorPrivateKey: string;
  parentTel: string;
  contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() { }

  getAccount(): IAccount {
    if ('account' in localStorage) {
      const account: IAccount = JSON.parse(localStorage.account);
      console.log(account.contact);
      return account;
    }
    return null;
  }

  saveAccount(account: IAccount) {
    localStorage.account = JSON.stringify(account);
  }
}
