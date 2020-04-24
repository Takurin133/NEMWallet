import { Component } from '@angular/core';
import { SymbolService } from '../service/symbol.service';
import { AccountService, PublicAccount, AggregateTransaction } from 'symbol-sdk';
import { TSAccountService } from '../service/tsaccount.service';
import { environment } from 'src/environments/environment';
import { ConfirmedTxInfo } from '../model/confirmed-tx-info';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  multisigAccount: PublicAccount;
  confirmTxs: ConfirmedTxInfo[];

  constructor(
    public accountService: TSAccountService,
    public symbolService: SymbolService,
  ) {}

  ionViewDidEnter() {
    this.setMultisigAccount();
    this.getConfirmTxs();
  }

  setMultisigAccount() {
    const tsAccount = this.accountService.getAccount();
    this.multisigAccount = PublicAccount.createFromPublicKey(
      tsAccount.multisigPublicKey, environment.node.networkType
    );
  }

  getConfirmTxs() {
    this.symbolService.getConfirmTxs(this.multisigAccount.address).subscribe(
      (txs) => {
        console.log(txs);
        this.confirmTxs = txs;
      }
    );
  }

}
