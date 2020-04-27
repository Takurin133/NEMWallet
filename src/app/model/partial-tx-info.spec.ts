import { PartialTxInfo } from './partial-tx-info';

describe('PartialTxInfo', () => {
  it('should create an instance', () => {
    expect(PartialTxInfo.txInfoFromAggregateTx(null)).toBeTruthy();
  });
});
