# AsyNTer

[![npm](https://img.shields.io/npm/l/express.svg)]()

[![Code Climate](https://codeclimate.com/github/Densaugeo/AsyNTer/badges/gpa.svg)](https://codeclimate.com/github/Densaugeo/AsyNTer)

Allows event to .emit() asynchronously - instead of being called immediately, event hadlers are added to the event queue

## Installation

Install with bower, npm, or link the AsyNTer.js from from your html:

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
var AsyNTer = require('async-emit');

Or with browserify:
var AsyNTer = require('./your/folder/async-emit');
~~~

## Usage

AsyNTer nodes can emit events similar to EventEmitter:

~~~
var node = new AsyNTer.Node();

node.on('foo', function() {
  // Event handler stuff
});

node.emit('foo'); // Sends event to the anonymous event handler
~~~

They also have a pipe syntax:

~~~
var nodeA = new AsyNTer.Node();
var nodeB = new AsyNTer.Node();

nodeB.doBar = function() {
  // Bar stuff
}

AsyNTer.pipe(nodeA, 'foo', nodeB, 'doBar');

node.emit('foo'); // Sends event to nodeB.doBar()
~~~

By default, events handlers are not called immediately. They are added to the event queue:

~~~
var nodeA = new AsyNTer.Node();
var called = false;

node.on('foo', function() {
  called = true;
});

node.emit('foo');

called; // Still false

setTimeout(function() {
  called; // Now it's true
}, 0);
~~~

However, events can still be emitted synchronously by using .emitSync() in place of .emit().

With the asynchronous approach, event loops can run indefinitely without overfilling the stack, and an event handler can emit it's own event as a sort of tail recursion:

~~~
var node = new AsyNTer.Node();

node.onrecurse = function() {
  // Event handler stuff
  
  this.emit('recurse');
}

AsyNTer.pipe(node, 'recurse', node, 'onrecurse');

node.emit('recurse'); // Keeps going and going, like a popular battery bunny
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
