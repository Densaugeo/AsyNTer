var assert = require('assert');
var sinon = require('sinon');
var DF = require('..');

// DFTestNode provides a DF.Node with a coule events already set up for testing
var DFTestNode = function DFTestNode() {
  DF.Node.call(this);
  
  this.onFoo = sinon.spy();
  
  this.onAdd = sinon.spy(function(numbers) {
    var result = 0;
    
    numbers.forEach(function(v) {
      result += v;
    });
    
    return result;
  });
  
  DF.pipe(this, 'add', this, 'onAdd');
  DF.pipe(this, 'foo', this, 'onFoo');
}
DFTestNode.prototype = Object.create(DF.Node.prototype);
DFTestNode.prototype.constructor = DFTestNode;

var nodeA = new DFTestNode();

suite('My 1st Mocha test suite (for DF)', function() {
  beforeEach(function() {
    nodeA = new DFTestNode();
  });
  
  test('\'foo\' event should fire \'foo\' listener', function(done) {
    nodeA.emit('foo');
    
    setImmediate(function() {
      assert.strictEqual(nodeA.onFoo.calledOnce, true);
      done();
    });
  });
  
  test('\'bar\' event should not fire \'foo\' listener', function(done) {
    nodeA.emit('bar');
    
    setImmediate(function() {
      assert.strictEqual(nodeA.onFoo.calledOnce, false);
      done();
    });
  });
  
  test('\'foo\' event from node A should not fire \'foo\' listener on node B', function(done) {
    var nodeB = new DFTestNode();
    
    nodeA.emit('foo');
    
    setImmediate(function() {
      assert.strictEqual(nodeB.onFoo.calledOnce, false);
      done();
    });
  });
  
  test('Packet object should be passed to event handler', function(done) {
    nodeA.emit('add', [1, 4]);
    
    setImmediate(function() {
      assert.strictEqual(nodeA.onAdd.returnValues[0], 5);
      done();
    });
  });
  
  test('Events should .emit() asynchronously', function() {
    nodeA.emit('foo');
    
    assert.strictEqual(nodeA.onFoo.calledOnce, false);
  });
  
  test('Events should .emitSync() synchronously', function() {
    nodeA.emitSync('foo');
    
    assert.strictEqual(nodeA.onFoo.calledOnce, true);
  });
  
  test('.on() should attach listeners as it does on EventEmitters', function(done) {
    var spy = sinon.spy();
    
    nodeA.on('foo', spy);
    
    nodeA.emit('foo');
    
    setImmediate(function() {
      assert.strictEqual(spy.calledOnce, true);
      done();
    });
  });
  
  test('Circular listeners should be able to recurse at least 100,000 times', function(done) {
    this.slow(1000);
    this.timeout(5000);
    
    var recursionDepth = 0;
    
    nodeA.onrecurse = function() {
      if(++recursionDepth < 1e+5) {
        this.emit('recurse');
      } else {
        assert.strictEqual(recursionDepth, 1e+5);
        done();
      }
    }
    
    DF.pipe(nodeA, 'recurse', nodeA, 'onrecurse');
    
    nodeA.emit('recurse');
  });
});