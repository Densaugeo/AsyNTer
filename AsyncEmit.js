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
  root.AE = factory();
}(this, function() {
  /**
   * @description Provides AE.Node, an asynchronous non-recursive EventEmitter replacement
   */
  var AE = {};
  
  // @method undefined pipe(AE.Node source, String sourcePort, AE.Node destination, String destinationPort) -- Connects AE Nodes. The destination's port function is called and given data from the source's port
  AE.pipe = function pipe(source, sourcePort, destination, destinationPort) {
    if(source._AEpipes[sourcePort] === undefined) {
      source._AEpipes[sourcePort] = [];
    }
    
    source._AEpipes[sourcePort].push(new AE.Pipe({node: destination, port: destinationPort}));
  }
  
  // Shim to provide setImmediate() in all browsers
  if(typeof setImmediate === 'undefined') {
    setImmediate = function setImmediate(cb) {
      setTimeout(cb, 0);
    }
  }
  
  /**
   * @module AE.Pipe
   * @description Represents the destination of a pipe made by AE.pipe() (for internal use)
   */
  AE.Pipe = function Pipe(options) {
    // @prop AE.Node node
    // @option AE.Node node -- Set .node property
    this.node = options.node;
    
    // @prop String port
    // @option String port -- Set .port property
    this.port = options.port;
  }
  
  /**
   * @module AE.Node
   * @description AE nodes are similar to EventEmitters
   * 
   * @example var node1 = new AE.Node();
   * @example var node2 = new AE.Node();
   * @example 
   * @example node2.onFoo = function(arg) {
   * @example   console.log(arg);
   * @example });
   * @example AE.pipe(node1, 'foo', node2, 'onFoo');
   * @example 
   * @example node.emit('foo', 'bar');
   */
  AE.Node = function Node() {
    // @prop [AE.Pipe] _AEpipes -- Array of destinations for AE pipes leading from this node. Not enumerable
    Object.defineProperty(this, '_AEpipes', {value: {}});
  }
  
  // @method proto undefined emit(String port, * data) -- Emit a packet. Passes 'data' argument on to listeners
  AE.Node.prototype.emit = function emit(port, data) {
    if(this._AEpipes[port]) {
      this._AEpipes[port].forEach(function(v) {
        setImmediate(function() {
          v.node[v.port](data);
        });
      });
    }
  }
  
  // @method proto undefined emitSync(String port, * data) -- Synchronous version of .emit()
  AE.Node.prototype.emitSync = function emitSync(port, data) {
    if(this._AEpipes[port]) {
      this._AEpipes[port].forEach(function(v) {
        v.node[v.port](data);
      });
    }
  }
  
  // @method proto AE.Node on(String port, Function listener) -- Adds a listener. Surprise
  AE.Node.prototype.on = function on(port, listener) {
    var a = {};
    a['on' + port] = listener;
    
    AE.pipe(this, port, a, 'on' + port);
    
    return this;
  }
  
  // @method proto AE.Node addListener(String port, Function listener) -- Alias for on
  AE.Node.prototype.addListener = AE.Node.prototype.on;
  
  // @method proto AE.Node addEventListener(String port, Function listener) -- Alias for on
  AE.Node.prototype.addEventListener = AE.Node.prototype.on;
  
  // Only one object to return, so no need for module object to hold it
  return AE;
})); // Module pattern
