const expect = require('chai').expect;
const timers = require('./');

describe('Guards', () => {
  let result;
  let data = 'data';

  timers.functions.forEach((fn) => {
    describe(`${fn.description}`, () => {
      beforeEach(() => {
        result = fn.f(data);
      });

      it('should resolve', () => {
        result.then((d) => {
          expect(d).to.equal(data);
        });
      });
    });
  });
});
