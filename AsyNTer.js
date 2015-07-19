(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  }
  
  if(typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  }
  
  // Browser globals (root is window)
  root.AsyNTer = factory();
}(this, function() {
  /**
   * @description Provides AsyNTer.Node, an asynchronous non-recursive EventEmitter replacement
   */
  var AsyNTer = {};
  
  // @method undefined pipe(AsyNTer.Node source, String sourcePort, AsyNTer.Node destination, String destinationPort) -- Connects AsyNTer Nodes. The destination's port function is called and given data from the source's port
  AsyNTer.pipe = function pipe(source, sourcePort, destination, destinationPort) {
    if(source._pipes[sourcePort] === undefined) {
      source._pipes[sourcePort] = [];
    }
    
    source._pipes[sourcePort].push(new AsyNTer.Pipe({node: destination, port: destinationPort}));
  }
  
  // Shim to provide setImmediate() in all browsers
  if(typeof setImmediate === 'undefined') {
    setImmediate = function setImmediate(cb) {
      setTimeout(cb, 0);
    }
  }
  
  /**
   * @module AsyNTer.Pipe
   * @description Represents the destination of a pipe made by AsyNTer.pipe() (for internal use)
   */
  AsyNTer.Pipe = function Pipe(options) {
    // @prop AsyNTer.Node node
    // @option AsyNTer.Node node -- Set .node property
    this.node = options.node;
    
    // @prop String port
    // @option String port -- Set .port property
    this.port = options.port;
  }
  
  /**
   * @module AsyNTer.Node
   * @description AsyNTer nodes are similar to EventEmitters
   * 
   * @example var node1 = new AsyNTer.Node();
   * @example var node2 = new AsyNTer.Node();
   * @example 
   * @example node2.onFoo = function(arg) {
   * @example   console.log(arg);
   * @example });
   * @example AsyNTer.pipe(node1, 'foo', node2, 'onFoo');
   * @example 
   * @example node.emit('foo', 'bar');
   */
  AsyNTer.Node = function Node() {
    // @prop [AsyNTer.Pipe] _pipes -- Array of destinations for AsyNTer pipes leading from this node. Not enumerable
    Object.defineProperty(this, '_pipes', {value: {}});
  }
  
  // @method proto undefined emit(String port, * data) -- Emit a packet. Passes 'data' argument on to listeners
  AsyNTer.Node.prototype.emit = function emit(port, data) {
    if(this._pipes[port]) {
      this._pipes[port].forEach(function(v) {
        setImmediate(function() {
          v.node[v.port](data);
        });
      });
    }
  }
  
  // @method proto undefined emitSync(String port, * data) -- Synchronous version of .emit()
  AsyNTer.Node.prototype.emitSync = function emitSync(port, data) {
    if(this._pipes[port]) {
      this._pipes[port].forEach(function(v) {
        v.node[v.port](data);
      });
    }
  }
  
  // @method proto AsyNTer.Node on(String port, Function listener) -- Adds a listener. Surprise
  AsyNTer.Node.prototype.on = function on(port, listener) {
    var a = {};
    a['on' + port] = listener;
    
    AsyNTer.pipe(this, port, a, 'on' + port);
    
    return this;
  }
  
  // @method proto AsyNTer.Node addListener(String port, Function listener) -- Alias for on
  AsyNTer.Node.prototype.addListener = AsyNTer.Node.prototype.on;
  
  // @method proto AsyNTer.Node addEventListener(String port, Function listener) -- Alias for on
  AsyNTer.Node.prototype.addEventListener = AsyNTer.Node.prototype.on;
  
  // Only one object to return, so no need for module object to hold it
  return AsyNTer;
})); // Module pattern
