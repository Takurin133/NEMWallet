import { LocalDateTime } from 'js-joda';

export interface IConfirmedTxInfo {
  height: number;
  deadline: LocalDateTime;
  id: string;
}
