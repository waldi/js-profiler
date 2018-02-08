'use strict';

const join = require('path').join;
const VERBOSITY = require(join(__appRoot, 'src/support/verbosity'));

const recursiveSum = {
  description: () => 'recursive sum',
  f: (d) => {
    if (d.length === 0) {
      return 0;
    }

    return d[0] + recursiveSum.f(d.slice(1));
  }
};

const tailRecursiveSum = {
  description: () => 'tail recursive sum',
  f: (d, i) => {
    if (typeof i === 'undefined') {
      i = 0;
    }

    if (d.length === 0) {
      return i;
    }

    i += d[0];
    return tailRecursiveSum.f(d.slice(1), i);
  }
};

const forReferenceSum = {
  description: () => 'for loop sum for reference',
  f: (d) => {
    let sum = 0;
    for (let i = 0; i < d.length; i++) {
      sum += d[i];
    }

    return sum;
  }
};

module.exports = {
  description: (verbosity) => {
    switch (verbosity) {
      case VERBOSITY.QUIET:
        return '';
      case VERBOSITY.VERBOSE:
        return 'Recurstion variations: Calculating sum of array of integers. Profile contains a simple for-loop for reference.';
      default:
        return 'Recursion';
    }
  },
  functions: [
    forReferenceSum,
    recursiveSum,
    tailRecursiveSum
  ],
  testDataType: 'array'
};
