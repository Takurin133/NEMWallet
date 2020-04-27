import { IPartialTxInfo } from '../interface/partial-tx-info';
import { InnerTxInfo } from './inner-tx-info';
import { LocalDateTime } from 'js-joda';
import { AggregateTransaction } from 'symbol-sdk';

export class PartialTxInfo implements IPartialTxInfo {
  deadline: LocalDateTime;
  id: string;
  txHash: string;
  innerTransactions: InnerTxInfo[];

  private constructor(aggregateTx: AggregateTransaction) {
    this.deadline = aggregateTx.deadline.value;
    this.id = aggregateTx.transactionInfo.id;
    this.txHash = aggregateTx.transactionInfo.hash;
    const innerTxInfo: InnerTxInfo[] = [];
    aggregateTx.innerTransactions.forEach((tx) => {
      const txInfo = InnerTxInfo.txInfoFromInnerTransaction(tx);
      innerTxInfo.push(txInfo);
    });
    this.innerTransactions = innerTxInfo;
  }

  public static txInfoFromAggregateTx(aggregateTx: AggregateTransaction) {
    return new PartialTxInfo(aggregateTx);
  }
}
