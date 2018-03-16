'use strict';

const EventEmitter = require('events');
const testdata = require('../support/testdata');
const profiler = require('../support/profiler');
const EVENTS = require('../support/events');
const UNITS = require('../support/units');

class ProfileRunner extends EventEmitter {

  /**
  * @constructor
  * @param {object} config Configuration object
  * @param {array} config.profiles An array of profiles
  * @param {number} config.iterations Number of iterations
  * @param {number} config.magnitude Magnitude of test data
  * @param {boolean} config.memory Set to true to measure memory consumption
  */
  constructor(config) {
    super();
    this.profiles = config.profiles.slice();
    this.iterations = config.iterations;
    this.magnitude = config.magnitude;
    this.memory = config.memory;
  }

  /**
  * Starts this ProfileRunner
  */
  run() {
    this.emit(EVENTS.START, this.profiles);
    return Promise.all(this.profiles.map((profile) => this.runProfile(profile)))
      .then((results) => {
        this.emit(EVENTS.END, results);
      })
      .catch((error) => {
        this.emit(EVENTS.ERROR, error);
      });
  }

  /**
  * Runs a single profile
  * @private
  * @param {object} profile A profile
  * @returns {object} The test result
  */
  runProfile(profile) {
    this.emit(EVENTS.PROFILE_START, profile);

    return new Promise((resolve) => {
      const functionPromises = profile.functions.map((func) =>
          this.runFunction(profile, func, testdata(profile.testDataType, this.magnitude)));

      Promise.all(functionPromises).then((results) => {
        const result = {
          profile,
          testResults: results
        };
        this.emit(EVENTS.PROFILE_END, profile, result);
        resolve(result);
      });
    });
  }

  /**
  * Runs a single profile function
  * @private
  * @param {object} profile A profile
  * @param {object} func A profile function
  * @param {any} data The test data
  * @returns {object} The test result
  */
  runFunction(profile, func, data) {
    return new Promise((resolve) => {
      if (func.testDataType) {
        data = testdata(func.testDataType, this.magnitude);
      }

      this.emit(EVENTS.TEST_START, profile, func);
      const result = {
        time: {
          average: 0,
          maximum: -Infinity,
          minimum: Infinity,
          total: 0
        },
        func
      };

      if (this.memory) {
        result.memory = {
          total: 0,
          average: 0,
          minimum: Infinity,
          maximum: -Infinity
        };
      }

      const profilePromises = [];
      for (let i = 0; i < this.iterations; i++) {
        profilePromises.push(profiler({
          fn: func.f,
          data,
          memory: this.memory
        }));
      }

      Promise.all(profilePromises).then((profiles) => {
        profiles.forEach((profile) => {
          const duration = UNITS.hrToMicro(profile.time);
          result.time.total += duration;
          if (this.memory) {
            result.memory.total += profile.heap;
            if (profile.heap < result.memory.minimum) {
              result.memory.minimum = profile.heap;
            }

            if (profile.heap > result.memory.maximum) {
              result.memory.maximum = profile.heap;
            }
          }

          if (duration < result.time.minimum) {
            result.time.minimum = duration;
          }

          if (duration > result.time.maximum) {
            result.time.maximum = duration;
          }
        });

        result.time.average = result.time.total / this.iterations;
        if (this.memory) {
          result.memory.average = result.memory.total / this.iterations;
        }

        this.emit(EVENTS.TEST_END, profile, func, result);
        resolve(result);
      });
    });
  }
}


module.exports = ProfileRunner;
