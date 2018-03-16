const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const sinon = require('sinon');
const profiler = require('./');

chai.use(require('sinon-chai'));
chai.use(chaiAsPromised);

describe('Profiler', () => {
  let fn;
  let profile;
  beforeEach(() => {
    fn = sinon.spy();
  });

  describe('when profiling a function', () => {
    beforeEach(() => {
      profile = profiler({
        fn
      });
    });

    it('should return an object', () => {
      expect(profile).to.eventually.be.an('object');
    });

    it('should return the time it took to execute the function', () => {
      expect(profile).to.eventually.have.property('time').that.is.an('array');
    });
  });

  describe('when memory measurement is enabled', () => {
    describe('without exposing the garbage collector', () => {
      let profile;
      let gcBak;
      beforeEach(() => {
        gcBak = global.gc;
        global.gc = undefined;
        profile = profiler({
          fn,
          memory: true
        });
      });

      afterEach(() => {
        global.gc = gcBak;
      });

      it('should throw an exception', () => {
        expect(profile).to.be.rejected;
      });
    });

    describe('and exposing the garbage collector', () => {
      beforeEach(() => {
        global.gc = sinon.spy();
        profile = profiler({
          fn,
          memory: true
        });
      });

      afterEach(() => {
        global.gc.reset();
      });

      it('should call the garbage collector', () => {
        expect(global.gc.called).to.be.true;
      });

      it('should return an object', () => {
        expect(profile).to.eventually.be.an('object');
      });

      it('should return the time it took to execute the function', () => {
        expect(profile).to.eventually.have.property('time').that.is.an('array');
      });

      it ('should return the heap space consumed when executing the function', () => {
        expect(profile).to.eventually.have.property('heap').that.is.a('number');
      });
    });
  });
});
