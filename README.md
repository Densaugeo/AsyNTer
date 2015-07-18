# AsyncEmit

Allows event to .emit() asynchronously - instead of being called immediately, event hadlers are added to the event queue

## Installation

Install with bower, npm, or link the AsyncEmit.js from from your html:

~~~
wget https://raw.githubusercontent.com/Densaugeo/AsyncEmit/master/AsyncEmit.js

OR

npm install --save git@github.com:Densaugeo/AsyncEmit.git

OR

bower install --save git@github.com:Densaugeo/AsyncEmit.git
~~~

## Import

Supports node.js, AMD, and browser global modules.

~~~
In your html:
<script type="text/javascript" src="/your/folders/AsyncEmit.js"></script>

Or in you node.js app:
var AE = require('async-emit');

Or with browserify:
var AE = require('./your/folder/async-emit');
~~~

## Usage

AE nodes can emit events similar to EventEmitter:

~~~
var node = new AE.Node();

node.on('foo', function() {
  // Event handler stuff
});

node.emit('foo'); // Sends event to the anonymous event handler
~~~

They also have a pipe syntax:

~~~
var nodeA = new AE.Node();
var nodeB = new AE.Node();

nodeB.doBar = function() {
  // Bar stuff
}

AE.pipe(nodeA, 'foo', nodeB, 'doBar');

node.emit('foo'); // Sends event to nodeB.doBar()
~~~

By default, events handlers are not called immediately. They are added to the event queue:

~~~
var nodeA = new AE.Node();
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
var node = new AE.Node();

node.onrecurse = function() {
  // Event handler stuff
  
  this.emit('recurse');
}

AE.pipe(node, 'recurse', node, 'onrecurse');

node.emit('recurse'); // Keeps going and going, like a popular battery bunny
~~~

## Development

To install with all development tools, clone this repo and use npm:

~~~
git clone git@github.com:Densaugeo/AsyncEmit.git

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
