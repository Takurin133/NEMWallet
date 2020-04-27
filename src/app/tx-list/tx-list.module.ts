import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InnerTxComponent } from './inner-tx/inner-tx.component';
import { TxHeaderComponent } from './tx-header/tx-header.component';
import { OtherInnerTxComponent } from './other-inner-tx/other-inner-tx.component';



@NgModule({
  declarations: [InnerTxComponent, TxHeaderComponent, OtherInnerTxComponent],
  exports: [InnerTxComponent, TxHeaderComponent, OtherInnerTxComponent],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class TxListModule { }
