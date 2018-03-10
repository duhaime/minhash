var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var Minhash = require('../src/minhash');

describe('minhash', function() {
  var m1 = new Minhash();
  describe('hashvalues', function() {
    it('should all be less than max hash', function() {
      m1.hashvalues.forEach(function(v) {
        (v <= m1.maxHash).should.equal(true);
      });
    });

    it('should update', function() {
      var _m1 = JSON.parse(JSON.stringify(m1));
      var updated = false;
      m1.update('cats');
      m1.hashvalues.forEach(function(v, i) {
        if (_m1.hashvalues[i] !== m1.hashvalues[i]) updated = true;
      })
      updated.should.equal(true);
    });

    it('should have len() === minhash.numPerm', function() {
      var m2 = new Minhash({numPerm: 256});
      (m2.hashvalues.length === m2.numPerm).should.equal(true);
    });
  });

  describe('permutations', function() {
    it('aPerm.length should equal bPerm.length', function() {
      (m1.permA.length === m1.permB.length).should.equal(true);
    })

    it('should be larger than 0 and less than maxHash', function() {
      m1.permA.forEach(function(p) {
        var inRange = p >= 0 && p <= m1.maxHash;
        inRange.should.equal(true);
      });
    });

    it('should not contain duplicates', function() {
      var seen = {};
      var vals = 0;
      var perms = [m1.permA, m1.permB];
      for (var i=0; i<perms.length; i++) {
        for (var j=0; j<perms[i].length; j++) {
          seen[ perms[i][j] ] = true;
          vals++;
        }
      }
      (Object.keys(seen).length === vals).should.equal(true);
    });
  });

  describe('jaccard', function() {
    it('should error when minhash seeds differ', function() {
      var m1 = new Minhash({seed: 2});
      var m2 = new Minhash({seed: 3});
      try{
        var result = m1.jaccard(m2);
      } catch(err) {
        err.should.be.an('error');
      }
    });

    it('should error when hashvalue length differ', function() {
      var m1 = new Minhash({numPerm: 128});
      var m2 = new Minhash({numPerm: 256});
      try {
        var result = m1.jaccard(m2);
      } catch(err) {
        err.should.be.an('error');
      }
    });
  });

  describe('randint', function() {
    it('should return values >=0 and <= maxHash', function() {
      var m1 = new Minhash();
      for (var i=0; i<1000; i++) {
        var num = m1.randInt();
        (num >= 0 && num <= m1.maxHash).should.equal(true);
      }
    });
  });
});