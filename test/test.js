var assert = require('assert');
var sinon = require('sinon');
var AE = require('..');

// AETestNode provides a AE.Node with a coule events already set up for testing
var AETestNode = function AETestNode() {
  AE.Node.call(this);
  
  this.onFoo = sinon.spy();
  
  this.onAdd = sinon.spy(function(numbers) {
    var result = 0;
    
    numbers.forEach(function(v) {
      result += v;
    });
    
    return result;
  });
  
  AE.pipe(this, 'add', this, 'onAdd');
  AE.pipe(this, 'foo', this, 'onFoo');
}
AETestNode.prototype = Object.create(AE.Node.prototype);
AETestNode.prototype.constructor = AETestNode;

var nodeA = new AETestNode();

suite('My 1st Mocha test suite (for AE)', function() {
  beforeEach(function() {
    nodeA = new AETestNode();
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
    var nodeB = new AETestNode();
    
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
    
    AE.pipe(nodeA, 'recurse', nodeA, 'onrecurse');
    
    nodeA.emit('recurse');
  });
});