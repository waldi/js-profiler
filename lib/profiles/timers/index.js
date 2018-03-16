const setTimeoutZeroMilliseconds = {
  description: 'setTimeout',
  f: (d) => new Promise((resolve) => setTimeout(() => resolve(d), 0))
};

module.exports = {
  name: 'timers',
  description: {
    short: 'Timers',
    long: 'Timers for creating async tasks.'
  },
  functions: [
    setTimeoutZeroMilliseconds
  ]
};
