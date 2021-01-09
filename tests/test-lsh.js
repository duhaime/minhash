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
    it.only('should return matches', function() {
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

    // we are creating hashband from threshold
    xit('should allow users to set hashband length', function() {
      var m1 = new Minhash();
      var index = new LshIndex({bandSize: 3});
      index.insert('m1', m1);
      (m1.hashbands[0].split('.').length === 3).should.equal(true);
    })
  });


  describe('threshold', function() {

    it('should get all documents as duplicate if threshold is 0.2', function() {
      const threshold = 0.2;

      const m1 = new Minhash();
      m1.update('the quick clever brown fox');

      const m2 = new Minhash();
      m2.update('the quick clever brown dog');

      const m3 = new Minhash();
      m3.update('the quick clever brown cat');

      const index = new LshIndex({threshold: threshold});
      index.insert('m1', m1);
      index.insert('m2', m2);
      index.insert('m3', m3);

      const results = index.query(m1);
      (results.length === 3).should.equal(true);
    });

    it('should get only 2 documents as duplicate if threshold is 0.32', function() {
      const threshold = 0.32;

      const m1 = new Minhash();
      m1.update('the quick clever brown fox');

      const m2 = new Minhash();
      m2.update('the quick clever brown dog');

      const m3 = new Minhash();
      m3.update('the quick clever brown cat');

      const index = new LshIndex({threshold: threshold});
      index.insert('m1', m1);
      index.insert('m2', m2);
      index.insert('m3', m3);

      const results = index.query(m1);
      (results.length === 2).should.equal(true);
    });

    it('should only get 1 document as duplicate if threshold is 0.8', function() {
      const threshold = 0.8;

      const m1 = new Minhash();
      m1.update('the quick clever brown fox');

      const m2 = new Minhash();
      m2.update('the quick clever brown dog');

      const m3 = new Minhash();
      m3.update('the quick clever brown cat');

      const index = new LshIndex({threshold: threshold});
      index.insert('m1', m1);
      index.insert('m2', m2);
      index.insert('m3', m3);

      const results = index.query(m1);
      (results.length === 1).should.equal(true);
      (results[0]).should.equal('m1');
    })
  });
})
