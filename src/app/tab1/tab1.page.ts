import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Account, NetworkType, TransferTransaction, Deadline, Address, NetworkCurrencyPublic, PlainMessage, UInt64, TransactionHttp } from 'symbol-sdk';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isOpen = false;
  opacity = 1;

  constructor(
    public barcodeScanner: BarcodeScanner,
  ) {}

  runQRScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData);
    }).catch((e) => {
      console.error(e);
    });
  }


  sendSymMock() {

    const privateKey = '6DC6BA3220098E81297220ED760A482C2DEFF456B318F2BBAE48385C81340180';
    const genHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
    const recipient = 'TAS3GLDV4JM5AEXNLA5K5W27CP2UEPO6NDAOCSOT';
    const transactionHttp = new TransactionHttp('https://sym-test.opening-line.jp:3001');

    const account = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
    const transferTx = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(recipient),
      [NetworkCurrencyPublic.createRelative(100)],
      PlainMessage.create('hello'),
      NetworkType.TEST_NET,
      UInt64.fromUint(20000)
    );
    const signedTx = account.sign(transferTx, genHash);
    transactionHttp.announce(signedTx).subscribe((x) => console.log(x));
  }

}
