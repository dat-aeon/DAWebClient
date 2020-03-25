import { MaritalStatusPipe } from './marital-status.pipe';

describe('MaritalStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new MaritalStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
