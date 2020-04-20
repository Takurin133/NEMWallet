import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

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

}
