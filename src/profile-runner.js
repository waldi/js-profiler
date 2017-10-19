'use strict';

const EventEmitter = require('events');
const join = require('path').join;
const clock = require(join(__appRoot, 'src/support/clock/clock'));
const events = require(join(__appRoot, 'src/support/events'));

class ProfileRunner extends EventEmitter {

  /**
  * @constructor
  * @param {object} config Configuration object
  * @param {array} config.profiles An array of profiles
  * @param {number} config.iterations Number of iterations
  * @param {array} config.data An array of test data
  */
  constructor(config) {
    super();
    this.profiles = config.profiles.slice();
    this.iterations = config.iterations;
    this.data = config.data;
  }

  /**
  * Starts this ProfileRunner
  */
  run() {
    try {
      this.emit(events.START, this.profiles);
      const results = this.profiles.map((profile) => this.runProfile(profile));
      this.emit(events.END, results);
    } catch (err) {
      this.emit(events.ERROR, err);
    }
  }

  /**
  * Runs a single profile
  * @private
  * @param {object} profile A profile
  * @returns {object} The test result
  */
  runProfile(profile) {
    this.emit(events.PROFILE_START, profile);
    const result = {
      profile,
      testResults: profile.functions.map((func) =>
        this.runFunction(profile, func))
    };
    this.emit(events.PROFILE_END, profile, result);
    return result;
  }

  /**
  * Runs a single profile function
  * @private
  * @param {object} profile A profile
  * @param {object} func A profile function
  * @returns {object} The test result
  */
  runFunction(profile, func) {
    this.emit(events.TEST_START, profile, func);
    const testResult = {
      averageTime: 0,
      totalTime: 0,
      func
    };

    for (let i = 0; i < this.iterations; i++) {
      testResult.totalTime += clock.time(func.f, this.data);
    }

    testResult.averageTime = testResult.totalTime / this.iterations;
    this.emit(events.TEST_END, profile, func, testResult);
    return testResult;
  }
}


module.exports = ProfileRunner;