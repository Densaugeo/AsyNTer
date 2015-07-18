# AsyncEmit.js

Provides DF.Node, an asynchronous non-recursive EventEmitter replacement

Dependencies: None

#### Methods

`undefined` **pipe**`(DF.Node source, String sourcePort, DF.Node destination, String destinationPort)` -- Connects DF Nodes. The destination's port function is called and given data from the source's port

---

## DF.Pipe

Inherits: None

Represents the destination of a pipe made by DF.pipe() (for internal use)

#### Options

`DF.Node` **node** -- Set .node property

`String` **port** -- Set .port property

#### Properties

`DF.Node` **node** 

`String` **port** 

---

## DF.Node

Inherits: None

DF nodes are similar to EventEmitters

```
var node1 = new DF.Node();
var node2 = new DF.Node();

node2.onFoo = function(arg) {
  console.log(arg);
});
DF.pipe(node1, 'foo', node2, 'onFoo');

node.emit('foo', 'bar');
```

#### Properties

`[DF.Pipe]` **_DFpipes** -- Array of destinations for DF pipes leading from this node. Not enumerable

#### Methods

`DF.Node` proto **addEventListener**`(String port, Function listener)` -- Alias for on

`DF.Node` proto **addListener**`(String port, Function listener)` -- Alias for on

`undefined` proto **emit**`(String port, * data)` -- Emit a packet. Passes 'data' argument on to listeners

`undefined` proto **emitSync**`(String port, * data)` -- Synchronous version of .emit()

`DF.Node` proto **on**`(String port, Function listener)` -- Adds a listener. Surprise

