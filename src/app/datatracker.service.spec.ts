import { TestBed } from '@angular/core/testing';

import { DatatrackerService } from './datatracker.service';

describe('DatatrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatatrackerService = TestBed.get(DatatrackerService);
    expect(service).toBeTruthy();
  });
});
