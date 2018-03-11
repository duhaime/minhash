var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var Minhash = require('../src/minhash.js');
var LshIndex = require('../src/lsh.js');

describe('LshIndex', function() {
  var index = new LshIndex();
  var m1 = new Minhash();
  describe('insertions', function() {
    it('should accept new insertions', function() {
      var _index = JSON.parse(JSON.stringify(index));
      index.insert('m1', m1);
      (Object.keys(index) === Object.keys(_index)).should.equal(false);
    });
  });

  describe('queries', function() {
    it('should return matches', function() {
      var m1 = new Minhash();
      var m2 = new Minhash();
      var index = new LshIndex();
      m1.update('hello');
      m2.update('hello');
      index.insert('m1', m1);
      index.insert('m2', m2);
      var results = index.query(m1);
      (results.indexOf('m2') > -1).should.equal(true);
    });
  });

  describe('hashbands', function() {
    it('should cache hashbands', function() {
      var m1 = new Minhash();
      var index = new LshIndex();
      index.insert('m1', m1);
      (m1.hashbands.length > 0).should.equal(true);
    });

    it('should allow users to set hashband length', function() {
      var m1 = new Minhash();
      var index = new LshIndex({bandSize: 3});
      index.insert('m1', m1);
      (m1.hashbands[0].split('.').length === 3).should.equal(true);
    })
  });
})