import { LocalDateTime } from 'js-joda';
import { InnerTxInfo } from '../model/inner-tx-info';

export interface IPartialTxInfo {
  deadline: LocalDateTime;
  id: string;
  innerTransactions: InnerTxInfo[];
}
