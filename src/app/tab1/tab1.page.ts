import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Account, NetworkType, TransferTransaction, Deadline,
  Address, NetworkCurrencyPublic, UInt64,
  PublicAccount, AggregateTransaction, HashLockTransaction,
  TransactionService, RepositoryFactoryHttp, Listener, NamespaceId, MosaicService } from 'symbol-sdk';
import { mergeMap, filter } from 'rxjs/operators';
import { IAccount, AccountService } from '../setting/account.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isOpen = false;
  opacity = 1;
  symbolQrData: {
    v: number,
    network_id: number,
    chain_id: number,
    data: { payload: string }
  };
  transferTx: TransferTransaction;
  endPoint: string;
  repository: RepositoryFactoryHttp;
  amount = 0;
  smsMessage = '';
  networkType: NetworkType;
  account: IAccount;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public loadingControler: LoadingController,
    public callNumber: CallNumber,
    public alertController: AlertController,
    public sms: SMS,
    public accountService: AccountService,
  ) {
    this.endPoint = environment.node.endPoint;
    this.networkType = environment.node.networkType;
    this.repository = new RepositoryFactoryHttp(this.endPoint);
    this.account = accountService.getAccount();
  }

  ionViewDidEnter() {
    this.account = this.accountService.getAccount();
    this.getAccountXym();
  }

  getAccountXym() {
    const multisigAddress = Address.createFromPublicKey(this.account.multisigPublicKey, this.networkType);
    const mosaicService = new MosaicService(this.repository.createAccountRepository(), this.repository.createMosaicRepository());
    mosaicService.mosaicsAmountViewFromAddress(multisigAddress)
    .pipe(
      mergeMap((_) => _),
      filter((m) => m.fullName() === environment.currencyId)
    ).subscribe((m) => {
      this.amount = m.relativeAmount();
    });
  }

  runQRScanner() {
    this.barcodeScanner.scan().then((barcodeData: BarcodeScanResult) => {
      if (!barcodeData.cancelled && barcodeData.format === 'QR_CODE') {
        const payload = this.parseQRJSON(barcodeData.text);
        if (payload) {
          this.parsePayload(payload);
        }
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  parseQRJSON(barcodeData: string): string {
    this.symbolQrData = JSON.parse(barcodeData);
    if (this.symbolQrData?.data?.payload) {
      console.log(this.symbolQrData.data.payload);
      return this.symbolQrData.data.payload;
    }
    return null;
  }

  parsePayload(payload) {
    const tx = TransferTransaction.createFromPayload(payload);
    if (tx.type === 0x4154) {
      this.transferTx = tx as TransferTransaction;
    }
  }

  recipientAddress(): string {
    if (!this.transferTx) {
      return '';
    }
    if (this.transferTx.recipientAddress instanceof Address) {
      return this.transferTx.recipientAddress.pretty();
    }

    if (this.transferTx.recipientAddress instanceof NamespaceId) {
      return this.transferTx.recipientAddress.fullName;
    }

    return '';
  }

  payAmount(): number {
    let amount: number = null;
    if (this.transferTx) {
      const sym = this.transferTx.mosaics.find((m) => {
        return m.id.toHex() === environment.currencyId;
      });
      if (sym) {
        const absolute = Number(sym.amount.toString());
        amount = absolute * Math.pow(10, -NetworkCurrencyPublic.DIVISIBILITY);
      }
    }
    return amount;
  }

  message(): string {
    if (!this.transferTx) {
      return '';
    }

    return this.transferTx.message.payload;
  }


  async payXym() {
    const cosignatoryPrivateKey = this.account.initiatorPrivateKey;
    const genHash = environment.node.generationHash;

    const wsEndpoint = this.endPoint.replace('http', 'ws');

    const transactionRep = this.repository.createTransactionRepository();
    const receiptRep = this.repository.createReceiptRepository();
    const listener = new Listener(wsEndpoint, WebSocket);

    const networkType = this.networkType;

    const cosignatory = Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
    const multisig = PublicAccount.createFromPublicKey(this.account.multisigPublicKey, networkType);

    const aggregateTx = AggregateTransaction.createBonded(
      Deadline.create(),
      [this.transferTx.toAggregate(multisig)],
      networkType,
    ).setMaxFeeForAggregate(100, 2);

    const signedAggregateTx = cosignatory.sign(aggregateTx, genHash);

    const hashLockTx = HashLockTransaction.create(
      Deadline.create(),
      NetworkCurrencyPublic.createRelative(10),
      UInt64.fromUint(1000),
      signedAggregateTx,
      networkType,
    ).setMaxFee(100);

    const signedHashLockTx = cosignatory.sign(hashLockTx, genHash);

    const transactionService = new TransactionService(transactionRep, receiptRep);

    const loading = await this.loadingControler.create({
      message: 'しはらいちゅう',
    });

    await loading.present();

    listener.open().then(() => {
      transactionService.announceHashLockAggregateBonded(signedHashLockTx, signedAggregateTx, listener).subscribe((x) => {
        console.log(x);
        this.smsMessage = this.message();
        this.resetPayStatus(listener, loading);
        this.showSendTxMessage().then();
      }, (err) => {
        console.error(err);
        this.resetPayStatus(listener, loading);
      });
    }).catch((err) => {
      console.error(err);
      this.transferTx = null;
      loading.dismiss();
    });
  }

  resetPayStatus(listener: Listener, loading: HTMLIonLoadingElement) {
    listener.close();
    this.transferTx = null;
    loading.dismiss();
    this.getAccountXym();
  }

  async showSendTxMessage() {
    const alert = await this.alertController.create({
      header: '送金依頼完了',
      message: 'しょうにんいらいをおくったよ。おかあさんかおとうさんにれんらくしよう',
      buttons: [
        {
          text: 'れんらくする',
          handler: () => {
            if (this.account.contact === 'tel') {
              this.callPhone();
            } else {
              this.sendSMS();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  callPhone() {
    this.callNumber.callNumber(this.account.parentTel, true).then(
      (res) => { console.log(`Lunched dialer: ${res}`); }
    ).catch((e) => { console.error(`Failed lunched dialer: ${e}`); });
  }

  sendSMS() {
    this.sms.send(this.account.parentTel, this.smsMessage).then();
    this.smsMessage = null;
  }

}
