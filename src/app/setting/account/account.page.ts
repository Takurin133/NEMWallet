import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAccount, AccountService } from '../account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    public accountService: AccountService,
    public modalController: ModalController,
  ) { }

  account: IAccount = {
    multisigPublicKey: null,
    initiatorPrivateKey: null,
    parentTel: null,
    contact: null,
  };
t;

  ngOnInit() {
  }

  ionViewWillEnter() {
    const account = this.accountService.getAccount();
    if (account) {
      this.account = account;
    }

    if (!this.account.contact) {
      this.account.contact = 'tel';
    }
  }

  saveAccount() {
    this.accountService.saveAccount(this.account);
    this.dismissModalController();
  }

  dismissModalController() {
    this.modalController.dismiss();
  }
  onChange(event) {
    this.account.contact = event.target.value;
  }

}
