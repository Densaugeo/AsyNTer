# AsyNTer.js

Provides AsyNTer.Node, an asynchronous non-recursive EventEmitter replacement

Dependencies: None

#### Methods

`undefined` **pipe**`(AsyNTer.Node source, String sourcePort, AsyNTer.Node destination, String destinationPort)` -- Connects AsyNTer Nodes. The destination's port function is called and given data from the source's port

---

## AsyNTer.Pipe

Inherits: None

Represents the destination of a pipe made by AsyNTer.pipe() (for internal use)

#### Options

`AsyNTer.Node` **node** -- Set .node property

`String` **port** -- Set .port property

#### Properties

`AsyNTer.Node` **node** 

`String` **port** 

---

## AsyNTer.Node

Inherits: None

AsyNTer nodes are similar to EventEmitters

```
var node1 = new AsyNTer.Node();
var node2 = new AsyNTer.Node();

node2.onFoo = function(arg) {
  console.log(arg);
});
AsyNTer.pipe(node1, 'foo', node2, 'onFoo');

node.emit('foo', 'bar');
```

#### Properties

`[AsyNTer.Pipe]` **_pipes** -- Array of destinations for AsyNTer pipes leading from this node. Not enumerable

#### Methods

`AsyNTer.Node` proto **addEventListener**`(String port, Function listener)` -- Alias for on

`AsyNTer.Node` proto **addListener**`(String port, Function listener)` -- Alias for on

`undefined` proto **emit**`(String port, * data)` -- Emit a packet. Passes 'data' argument on to listeners

`undefined` proto **emitSync**`(String port, * data)` -- Synchronous version of .emit()

`AsyNTer.Node` proto **on**`(String port, Function listener)` -- Adds a listener. Surprise

