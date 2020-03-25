import { CompanyStatusPipe } from './company-status.pipe';

describe('CompanyStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new CompanyStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
