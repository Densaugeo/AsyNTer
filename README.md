# AsyNTer

Allows events to .emit() asynchronously - instead of being called immediately, event handlers are added to the event queue.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Code Climate](https://codeclimate.com/github/Densaugeo/AsyNTer/badges/gpa.svg)](https://codeclimate.com/github/Densaugeo/AsyNTer)
[![Build Status](https://app.travis-ci.com/Densaugeo/AsyNTer.svg?branch=master)](https://app.travis-ci.com/github/Densaugeo/AsyNTer)

## Installation

Install with bower, npm, or link AsyNTer.js from your html:

~~~
wget https://raw.githubusercontent.com/Densaugeo/AsyNTer/master/AsyNTer.js

OR

npm install --save https://github.com/Densaugeo/AsyNTer.git

OR

bower install --save https://github.com/Densaugeo/AsyNTer.git
~~~

## Import

Supports node.js, AMD, and browser global modules.

~~~
In your html:
<script type="text/javascript" src="/your/folders/AsyNTer.js"></script>

Or in you node.js app:
var asynter = require('async-emit');

Or with browserify:
var asynter = require('./your/folder/async-emit');
~~~

## Usage

AsyNTer nodes can emit events similar to EventEmitter:

~~~
var node = new asynter.Node();

node.on('foo', function() {
  console.log('foo');
});

node.emit('foo'); // Sends event to the anonymous event handler
~~~

They also have a pipe syntax:

~~~
var nodeA = new asynter.Node();
var nodeB = new asynter.Node();

nodeB.doBar = function() {
  console.log('doBar');
}

asynter.pipe(nodeA, 'foo', nodeB, 'doBar');

nodeA.emit('foo'); // Sends event to nodeB.doBar()
~~~

By default, events handlers are not called immediately. They are added to the event queue:

~~~
var node = new asynter.Node();
var called = false;

node.on('foo', function() {
  called = true;
});

node.emit('foo');

console.log(called); // Still false

setImmediate(function() {
  console.log(called); // Now it's true
});
~~~

However, events can still be emitted synchronously by using .emitSync() in place of .emit().

With the asynchronous approach, event loops can run indefinitely without overfilling the stack, and an event handler can emit it's own event as a sort of tail recursion:

~~~
var node = new asynter.Node();

node.onrecurse = function(i) {
  console.log('Recursed ' + i + ' times');
  
  this.emit('recurse', i + 1);
}

asynter.pipe(node, 'recurse', node, 'onrecurse');

node.emit('recurse', 0); // Keeps going and going, like a popular battery bunny
~~~

## Development

To install with all development tools, clone this repo and use npm:

~~~
git clone git@github.com:Densaugeo/AsyNTer.git

npm install
~~~

Linter is JSHint, test runner is Mocha, documenter is Thoth. All have npm script hooks:

~~~
# Run linter
npm run lint

# Run tests
npm run test

# Refresh docs
npm run doc
~~~

## License

MIT
