import { InnerTxInfo } from './inner-tx-info';

describe('TxInfo', () => {
  it('should create an instance', () => {
    expect(InnerTxInfo.txInfoFromInnerTransaction(null)).toBeTruthy();
  });
});
