import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { Account, NetworkType, TransferTransaction, Deadline,
  Address, NetworkCurrencyPublic, UInt64,
  PublicAccount, AggregateTransaction, HashLockTransaction,
  TransactionService, RepositoryFactoryHttp, Listener, NamespaceId, MosaicService } from 'symbol-sdk';
import { mergeMap, filter } from 'rxjs/operators';


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
  multsigAccountPubKey = '2591ACAE34EE6044C4197DCC763DAC20C5CDEAE09DB5E32AB72DC4B5B943AB8A';
  endPoint = 'https://sym-test.opening-line.jp:3001';
  repository = new RepositoryFactoryHttp(this.endPoint);
  amount = 0;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public loadingControler: LoadingController,
  ) {}

  ionViewDidEnter() {
    this.getAccountXym();
  }

  getAccountXym() {
    const multisigAddress = Address.createFromPublicKey(this.multsigAccountPubKey, NetworkType.TEST_NET);
    const mosaicService = new MosaicService(this.repository.createAccountRepository(), this.repository.createMosaicRepository());
    mosaicService.mosaicsAmountViewFromAddress(multisigAddress)
    .pipe(
      mergeMap((_) => _),
      filter((m) => m.fullName() === '747B276C30626442')
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
        return m.id.id.toHex() === '747B276C30626442';
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
    const cosignatoryPrivateKey = '8458373A2CC9FC919D1E339E0D21B3313C7460EC2EC28875E53E8CA9A8B79B31';
    const genHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';

    const wsEndpoint = this.endPoint.replace('http', 'ws');

    const transactionRep = this.repository.createTransactionRepository();
    const receiptRep = this.repository.createReceiptRepository();
    const listener = new Listener(wsEndpoint, WebSocket);

    const networkType = NetworkType.TEST_NET;

    const cosignatory = Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
    const multisig = PublicAccount.createFromPublicKey(this.multsigAccountPubKey, networkType);

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
        this.resetPayStatus(listener, loading);
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

}
