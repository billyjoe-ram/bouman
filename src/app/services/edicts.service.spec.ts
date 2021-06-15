import { TestBed } from '@angular/core/testing';

import { EdictsService } from './edicts.service';

describe('EdictsService', () => {
  let service: EdictsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdictsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
