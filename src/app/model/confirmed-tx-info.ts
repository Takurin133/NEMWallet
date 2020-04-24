import { IConfirmedTxInfo } from '../interface/confirmed-tx-info';
import { IInnerTxInfo } from '../interface/inner-tx-info';
import { AggregateTransaction } from 'symbol-sdk';
import { LocalTime, LocalDateTime } from 'js-joda';
import { InnerTxInfo } from './inner-tx-info';

export class ConfirmedTxInfo implements IConfirmedTxInfo {
  height: number;
  deadline: LocalDateTime;
  id: string;
  innerTransactions: InnerTxInfo[];

  private constructor(aggregateTx: AggregateTransaction) {
    this.height = Number(aggregateTx.transactionInfo.height.toString());
    this.deadline = aggregateTx.deadline.value;
    this.id = aggregateTx.transactionInfo.id;
    const innerTxInfo: InnerTxInfo[] = [];
    aggregateTx.innerTransactions.forEach((tx) => {
      const txInfo = InnerTxInfo.txInfoFromInnerTransaction(tx);
      innerTxInfo.push(txInfo);
    });
    this.innerTransactions = innerTxInfo;
  }

  public static txInfoFromAggregateTx(aggregateTx: AggregateTransaction) {
    return new ConfirmedTxInfo(aggregateTx);
  }
}
