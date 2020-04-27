import { LocalDateTime } from 'js-joda';
import { InnerTxInfo } from '../model/inner-tx-info';

export interface IConfirmedTxInfo {
  height: number;
  deadline: LocalDateTime;
  id: string;
  innerTransactions: InnerTxInfo[];
}
