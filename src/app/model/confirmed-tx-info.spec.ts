import { ConfirmedTxInfo } from './confirmed-tx-info';

describe('ConfirmedTxInfo', () => {
  it('should create an instance', () => {
    expect(ConfirmedTxInfo.txInfoFromAggregateTx(null)).toBeTruthy();
  });
});
