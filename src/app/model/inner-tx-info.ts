import { IInnerTxInfo } from '../interface/inner-tx-info';
import { InnerTransaction, TransactionType, Transaction, TransferTransaction, NetworkCurrencyPublic, Address } from 'symbol-sdk';
import { environment } from 'src/environments/environment';
import { resolveTxt } from 'dns';

export class InnerTxInfo implements IInnerTxInfo {
  recipient: string;
  amount: number;
  message: string;
  type: number;

  private constructor(innerTx: InnerTransaction) {
    this.type = innerTx.type;
    if (innerTx.type === TransactionType.TRANSFER) {
      const tx = innerTx as TransferTransaction;
      const xym = tx.mosaics.find((m) => m.id.toHex() === environment.currencyId);
      if (xym) {
        const absolute = Number(xym.amount.toString());
        this.amount = absolute * Math.pow(10, -NetworkCurrencyPublic.DIVISIBILITY);
        this.message = tx.message.payload;
        if (tx.recipientAddress instanceof Address) {
          this.recipient = tx.recipientAddress.pretty();
        } else {
          this.recipient = tx.recipientAddress.id.toHex();
        }
      }
    }
  }

  public static txInfoFromInnerTransaction(innerTx: InnerTransaction) {
    return new InnerTxInfo(innerTx);
  }

  sendXymTx() {
    return this.type === TransactionType.TRANSFER && this.amount;
  }


}
