import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAccount, AccountService } from '../account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  account: IAccount = {
    multisigPublicKey: null,
    initiatorPrivateKey: null,
    parentTel: null,
  };

  constructor(
    public accountService: AccountService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const account = this.accountService.getAccount();
    if (account) {
      this.account = account;
    }
  }

  saveAccount() {
    this.accountService.saveAccount(this.account);
    this.dismissModalController();
  }

  dismissModalController() {
    this.modalController.dismiss();
  }

}
