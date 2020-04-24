import { TestBed } from '@angular/core/testing';

import { TSAccountService } from './tsaccount.service';

describe('AccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    // tslint:disable-next-line: deprecation
    const service: TSAccountService = TestBed.get(TSAccountService);
    expect(service).toBeTruthy();
  });
});
