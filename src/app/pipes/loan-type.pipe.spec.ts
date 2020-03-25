import { LoanTypePipe } from './loan-type.pipe';

describe('LoanTypePipe', () => {
  it('create an instance', () => {
    const pipe = new LoanTypePipe();
    expect(pipe).toBeTruthy();
  });
});
