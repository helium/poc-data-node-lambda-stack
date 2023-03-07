# @teleology/fp

A collection of functional utilities supporting pipes


## pipe 

Accepts a variadic list of functions and passes one argument to the next from top-to-bottom.

Example:
```javascript
const { pipe } = require('@teleology/fp');

const a = (s) => s - 12;
const b = (s) => s * 3;

pipe(
    a, 
    b, 
    console.log
)(10); // -6
```


## compose 

Accepts a variadic list of functions and passes one argument to the next from bottom-to-top. 

Example:
```javascript
const { compose } = require('@teleology/fp');

const a = (s) => s - 12;
const b = (s) => s * 3;

compose(
    console.log,
    a, 
    b
)(10); // 18
```


## parallel

Accepts a variadic list of functions and returns a curried function. The curried function can then be invoked and will delegate its arguments in parallel across the functions. 

Example:
```javascript
const { parallel } = require('@teleology/fp');
const logDb = require('./apis/logs');

// Writes to both local logs as well as to our external api
const logger = parallel(
    logDb,
    console.log
);

logger({
    source: 'app',
    action: 'clicked login',
    time: Date.now(),
});
```


## toss

Curries an error message returning an invocable function to throw. The invocable function can accept params 
to assign additional data to the Error.

Example:
```javascript
const { toss } = require('@teleology/fp');

toss('An error occured')({ code: 403, reason: 'Entity already exists' });
// Error: An error occured
//     ...
//     at internal/main/run_main_module.js:17:47 {
//   code: 403, 
//   reason: 'Entity already exists'
// }
```


## pick

Curry a dot notation path and default value, returns an invocable function requiring a target object.

Example:
```javascript
const { pick } = require('@teleology/fp');

pick('[0].a.b')([
  {
    a: {
      b: 'hello',
    },
  },
]); // hello
```


## map

A curried map function to be invoked within an Array.

Example:
```javascript
const { map } = require('@teleology/fp');

map((a) => a.id)([
  {
    id: '1',
  },
  {
    id: '2',
  },
]); // [ '1', '2' ]
```


## filter

A curried filter function to be invoked within an Array. 

Example:
```javascript
const { filter } = require('@teleology/fp');

filter((a) => a.id === '1')([
  {
    id: '1',
  },
  {
    id: '2',
  },
]); // [ { id: '1' } ]
```


## find

A curried find function to be invoked within an Array. 

Example:
```javascript
const { find } = require('@teleology/fp');

find((a) => a.id === '1')([
  {
    id: '1',
  },
  {
    id: '2',
  },
]); // { id: '1' }
```


## clean

Recursively removes empty values. An empty value is: `null, empty string, undefined, an empty array or object`.

Example:
```javascript
const { clean } = require('@teleology/fp');

clean({
  a: null,
  b: '',
  c: undefined,
  d: {},
  e: [],
  f: 'hello',

  nested: { will: { be: { removed: {} } } },
}); // { f: 'hello' }
```


## nonce

Wraps a function and prevents it from being called more than `n` times. Optional second params is the number of times, default is `once`.

Example:
```javascript
const { nonce } = require('@teleology/fp');

const log = nonce(console.log);

log('hi'); // hi
log('bonjour');
```

## retry

Given a function that may throw, retry up to `n` times.

Example:
```javascript
const { retry } = require('@teleology/fp');

const greet = retry(async (name) => {
  throw new Error(`${name}, failed to be greeted`);
}, 3);

greet('bob').catch(console.log); // e Error: bob, failed to be greeted
```


## settle
Mimics the traditional `Promise.all` but wraps each promise to avoid a throw. Errors contain a reason, successes a value. If a single promise is passed in, the result is a curried promise whose result is wrapped.

```javascript
const { settle } = require('@teleology/fp');

const ps = [0, 1, 2, 3, 4].map((a) => (async () => a)());

settle(ps).then(console.log);
// [
//   { success: true, value: 0 },
//   { success: true, value: 1 },
//   { success: true, value: 2 },
//   { success: true, value: 3 },
//   { success: true, value: 4 },
// ]

const safe = settle(async (num) => {
  throw new Error(`Failed, ${num}`);
});

safe(10).then(console.log);
// {
//   success: false,
//   reason: Error: Failed, 10
//   ...
// }
```

## timeout
Curries a given function, millis and ensures an error is thrown when a timeout occurs. 

```javascript
const { timeout } = require('@teleology/fp');

const timed = timeout(
  async () => new Promise((resolve) => setTimeout(resolve, 9000)), // long running task
  200, // timeout
);

timed('hello').then(console.log).catch(console.log);
```

## poll
A wrapper around a functon to long-poll at pre-defined intervals. Can be used with defaults or a custom rolloff function.

```javascript
const { poll } = require('@teleology/fp');

const fn = async () => console.log('hello');

const cancel = poll(fn); // calls fn every 200ms

const cancel2 = poll(fn, 1000); // calls fn every 1000ms

const linear = async (i) => new Promise((res) => setTimeout(res, i * 1000));

const cancel3 = poll(fn, linear); // rolls off in a lineaer fashion
```

## noop
A function that does nothing. 

```javascript
const { noop } = require('@teleology/fp');

// I do nothing
noop();
```


----

## Changelog 

**1.0.14**
- Added `noop` function

**1.0.10**
- Adding `timeout` function

**1.0.9**
- Adding `retry, settle` functions
- Bug fixes for pipe + compose

**1.0.6**
- Adding `once` function

**1.0.4**
- Adding a clean function to remove empty values

**1.0.1**

- Renaming broadcast to parallel
- Added find, filter functions
- Updated README with examples
- Updated `toss` to be invoked later to capture param