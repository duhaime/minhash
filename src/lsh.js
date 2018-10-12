'use strict';

/**
* Main class for indexing Minhash signatures
**/

var LshIndex = function (args) {
  args = args || {};
  this.bandSize = args.bandSize || 4;
  this.index = {};

  this.insert = function (key, minhash) {
    var hashbands = this.getHashbands(minhash);
    for (var i = 0; i < hashbands.length; i++) {
      var band = hashbands[i];
      if (Array.isArray(this.index[band])) {
        this.index[band].push(key);
      } else {
        this.index[band] = [key];
      }
    }
  };

  this.query = function (minhash) {
    var matches = {};
    var hashbands = this.getHashbands(minhash);
    for (var i = 0; i < hashbands.length; i++) {
      var band = hashbands[i];
      if (this.index.hasOwnProperty(band)) {
        for (let j = 0; j < this.index[band].length; j++) {
          if (!matches.hasOwnProperty([this.index[band][j]])) matches[this.index[band][j]] = { hits: 0, result: 0 };
          matches[this.index[band][j]].hits++;
          matches[this.index[band][j]].result = matches[this.index[band][j]].hits / hashbands.length;
        }
      }
    }
    return Object.keys(matches).map(match => {
      matches[match].name = match;
      return matches[match];
    });
  };

  this.getHashbands = function (minhash) {
    if (minhash.hashbands) return minhash.hashbands;
    minhash.hashbands = [];
    for (var i = 0; i < minhash.hashvalues.length / this.bandSize; i++) {
      var start = i * this.bandSize;
      var end = start + this.bandSize;
      var band = minhash.hashvalues.slice(start, end);
      minhash.hashbands.push(band.join('.'));
    }
    return minhash.hashbands;
  };
};

if (typeof window !== 'undefined') window.LshIndex = LshIndex;

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = LshIndex;
  }
  exports = LshIndex;
}
