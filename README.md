# JS Performance

JavaScript profiling tool and collection of profiling modules and benchmarks.

## Installation

`npm i [-g] js-performance`

## Usage

### CLI

If installed with the `-g` flag you can simply run js-performance from your command line:

![Intro](intro.gif)

For further information please refer to the [CLI documentation](docs/cli.md).

### Library

```javascript
// 1. Import the library
const jsperformance = require('js-performance');

// 2. Run the profiler
jsperformance()
  .then((report) => {
    console.log(JSON.stringify(report, null, 2));
  });
```

For configuration options please refer to the [Library documentation](docs/lib.md).


## [Changelog](CHANGELOG.md)

## [License](LICENSE)
