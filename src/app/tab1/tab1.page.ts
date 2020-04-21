import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Account, NetworkType, TransferTransaction, Deadline,
   Address, NetworkCurrencyPublic, PlainMessage, UInt64,
    PublicAccount, AggregateTransaction, HashLockTransaction, TransactionService, RepositoryFactoryHttp, Listener } from 'symbol-sdk';

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
    const cosignatoryPrivateKey = '8458373A2CC9FC919D1E339E0D21B3313C7460EC2EC28875E53E8CA9A8B79B31';
    const multisigPublicKey = '2591ACAE34EE6044C4197DCC763DAC20C5CDEAE09DB5E32AB72DC4B5B943AB8A';
    const genHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
    const recipient = 'TAS3GLDV4JM5AEXNLA5K5W27CP2UEPO6NDAOCSOT';

    const endPoint = 'https://sym-test.opening-line.jp:3001';
    const wsEndpoint = endPoint.replace('http', 'ws');
    const repository = new RepositoryFactoryHttp(endPoint);

    const transactionRep = repository.createTransactionRepository();
    const receiptRep = repository.createReceiptRepository();
    const listener = new Listener(wsEndpoint, WebSocket);

    const networkType = NetworkType.TEST_NET;

    const cosignatory = Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
    const multisig = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const transferTx = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress(recipient),
      [NetworkCurrencyPublic.createRelative(100)],
      PlainMessage.create('hello multisig'),
      networkType,
    );

    const aggregateTx = AggregateTransaction.createBonded(
      Deadline.create(),
      [transferTx.toAggregate(multisig)],
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

    listener.open().then(() => {
      transactionService.announceHashLockAggregateBonded(signedHashLockTx, signedAggregateTx, listener).subscribe((x) => {
        console.log(x);
        listener.close();
      }, (err) => {
        console.error(err);
        listener.close();
      });
    }).catch((err) => {
      console.error(err);
    });

  }

}
