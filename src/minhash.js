'use strict';

/**
* Minhash class - generates minhash signatures for set
**/

var Minhash = function(config) {

  // prime is the smallest prime larger than the largest
  // possible hash value (max hash = 32 bit int)
  this.prime = 4294967311;
  this.maxHash = Math.pow(2, 32) - 1;

  // initialize the hash values as the maximum value
  this.inithashvalues = function() {
    for (var i=0; i<this.numPerm; i++) {
      this.hashvalues.push(this.maxHash);
    }
  }

  // initialize the permutation functions for a & b
  // don't reuse any integers when making the functions
  this.initPermutations = function() {
    var used = {};
    for (var i=0; i<2; i++) {
      var perms = [];
      for (var j=0; j<this.numPerm; j++) {
        var int = this.randInt();
        while (used[int]) int = this.randInt();
        perms.push(int);
        used[int] = true;
      }
      var key = ['permA', 'permB'][i];
      this[key] = perms;
    }
  }

  // the update function updates internal hashvalues given user data
  this.update = function(str) {
    for (var i=0; i<this.hashvalues.length; i++) {
      var a = this.permA[i];
      var b = this.permB[i];
      var hash = (a * this.hash(str) + b) % this.prime;
      if (hash < this.hashvalues[i]) {
        this.hashvalues[i] = hash;
      }
    }
  }

  // hash a string to a 32 bit unsigned int
  this.hash = function(str) {
    var hash = 0;
    if (str.length == 0) {
      return hash + this.maxHash;
    }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // convert to a 32bit integer
    }
    return hash + this.maxHash;
  }

  // estimate the jaccard similarity to another minhash
  this.jaccard = function(other) {
    if (this.hashvalues.length != other.hashvalues.length) {
      throw new Error('hashvalue counts differ');
    } else if (this.seed != other.seed) {
      throw new Error('seed values differ');
    }
    var shared = 0;
    for (var i=0; i<this.hashvalues.length; i++) {
      shared += this.hashvalues[i] == other.hashvalues[i];
    }
    return shared / this.hashvalues.length;
  }

  // return a random integer >= 0 and <= maxHash
  this.randInt = function() {
    var x = Math.sin(this.seed++) * this.maxHash;
    return Math.floor((x - Math.floor(x)) * this.maxHash);
  }

  // initialize the minhash
  var config = config || {};
  this.numPerm = config.numPerm || 128;
  this.seed = config.seed || 1;
  this.hashvalues = [];
  this.permA = [];
  this.permB = [];
  // share permutation functions across all minhashes
  this.inithashvalues();
  this.initPermutations();
};

if (typeof window !== 'undefined') window.Minhash = Minhash;

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Minhash;
  }
  exports = Minhash;
}