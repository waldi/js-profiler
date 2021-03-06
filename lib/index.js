const profiles = require('./profiles');
const DEFAULTS = require('./support/defaults');
const ProfileRunner = require('./profile-runner');
const Reporter = require('./reporter/reporter');
const ConsoleReporter = require('./reporter/console');
const JSONReporter = require('./reporter/json');

module.exports = {
  list: (verbosity = DEFAULTS.verbosity) =>
    profiles.map((profile) => ({
      name: profile.name,
      description: profile.description,
      functions: profile.functions.map((f) => f.description)
    })),
  run: (opts) => {
    const options = Object.assign({}, DEFAULTS, opts);
    let p = profiles.slice();
    if (Array.isArray(options.profiles)) {
      p = profiles.filter((profile) =>
        options.profiles.includes(profile.name));
    }

    let reporter;
    if (options.json) {
      reporter = new JSONReporter(options);
    } else if (options.console) {
      reporter = new ConsoleReporter(options);
    } else {
      reporter = new Reporter(options);
    }

    const profileRunner = new ProfileRunner({
      iterations: options.iterations,
      magnitude: options.magnitude,
      memory: options.memory,
      profiles: p
    });

    const promise = reporter.reportOn(profileRunner);
    profileRunner.run();
    return promise;
  }
};
