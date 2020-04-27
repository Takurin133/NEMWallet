import { Component } from '@angular/core';
import { SymbolService } from '../service/symbol.service';
import { AccountService, PublicAccount, AggregateTransaction } from 'symbol-sdk';
import { TSAccountService } from '../service/tsaccount.service';
import { environment } from 'src/environments/environment';
import { ConfirmedTxInfo } from '../model/confirmed-tx-info';
import { PartialTxInfo } from '../model/partial-tx-info';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  multisigAccount: PublicAccount;
  confirmTxs: ConfirmedTxInfo[];
  partialTxs: PartialTxInfo[];

  constructor(
    public accountService: TSAccountService,
    public symbolService: SymbolService,
  ) {}

  ionViewDidEnter() {
    this.setMultisigAccount();
    this.getConfirmTxs();
    this.getPartialTxs();
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
        this.confirmTxs = txs;
      }
    );
  }

  confirmTxsTrackBy(index, item: ConfirmedTxInfo) {
    return item.id;
  }

  getPartialTxs() {
    this.symbolService.getPartialTxs(this.multisigAccount.address).subscribe(
      (txs) => {
        console.log(txs);
        this.partialTxs = txs;
      }
    );
  }

  partialTxsTrackBy(index, item: PartialTxInfo) {
    return item.id;
  }
}
