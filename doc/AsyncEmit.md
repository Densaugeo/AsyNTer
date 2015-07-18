# AsyncEmit.js

Provides AE.Node, an asynchronous non-recursive EventEmitter replacement

Dependencies: None

#### Methods

`undefined` **pipe**`(AE.Node source, String sourcePort, AE.Node destination, String destinationPort)` -- Connects AE Nodes. The destination's port function is called and given data from the source's port

---

## AE.Pipe

Inherits: None

Represents the destination of a pipe made by AE.pipe() (for internal use)

#### Options

`AE.Node` **node** -- Set .node property

`String` **port** -- Set .port property

#### Properties

`AE.Node` **node** 

`String` **port** 

---

## AE.Node

Inherits: None

AE nodes are similar to EventEmitters

```
var node1 = new AE.Node();
var node2 = new AE.Node();

node2.onFoo = function(arg) {
  console.log(arg);
});
AE.pipe(node1, 'foo', node2, 'onFoo');

node.emit('foo', 'bar');
```

#### Properties

`[AE.Pipe]` **_AEpipes** -- Array of destinations for AE pipes leading from this node. Not enumerable

#### Methods

`AE.Node` proto **addEventListener**`(String port, Function listener)` -- Alias for on

`AE.Node` proto **addListener**`(String port, Function listener)` -- Alias for on

`undefined` proto **emit**`(String port, * data)` -- Emit a packet. Passes 'data' argument on to listeners

`undefined` proto **emitSync**`(String port, * data)` -- Synchronous version of .emit()

`AE.Node` proto **on**`(String port, Function listener)` -- Adds a listener. Surprise

