'use strict';

/**
* Main class for indexing Minhash signatures
**/

var LshIndex = function(args={}) {
  this.threshold = args.threshold || 0.5;
  this.numberOfPermutation =args.numberOfPermutation || 128;

  this.index = {};

  this.insert = function(key, minhash) {
    var hashbands = this.getHashbands(minhash);
    for (var i=0; i<hashbands.length; i++) {
      var band = hashbands[i];
      if (Array.isArray(this.index[band])) {
        this.index[band].push(key);
      } else {
        this.index[band] = [key];
      }
    };
  };

  this.query = function(minhash) {
    var matches = {};
    var hashbands = this.getHashbands(minhash);
    for (var i=0; i<hashbands.length; i++) {
      var band = hashbands[i];
      for (var j=0; j<this.index[band].length; j++) {
        matches[this.index[band][j]] = true;
      };
    };
    return Object.keys(matches);
  };

  this.getHashbands = function(minhash) {
    const bandAndRow = this.getOptimalBandAndRows();

    if (bandAndRow.band * bandAndRow.row > this.numberOfPermutation) {
      throw new Error(`Band and Row should be less than Number of Permutation.`);
    }

    if (minhash.hashbands) return minhash.hashbands;
    minhash.hashbands = [];
    for (let i=0; i<bandAndRow.band; i++) {
      const start = i * bandAndRow.row;
      const end = start + bandAndRow.row;
      const band = minhash.hashvalues.slice(start, end);
      minhash.hashbands.push(band.join('.'));
    }
    return minhash.hashbands;
  };

  this.getOptimalBandAndRows = function(falsePositiveWeight= 0.5, falseNegativeWeight = 0.5) {
    const bandAndRow = {
      band: 0,
      row: 0
    };

    let minError = Number.MAX_SAFE_INTEGER;
    for (let b = 1; b < this.numberOfPermutation + 1; b++) {
      const maxRow = this.numberOfPermutation / b | 0;
      for (let r = 1; r < maxRow + 1; r++) {
        const fp = this.getFalsePositive(b, r);
        const fn = this.getFalseNegative(b, r);
        const error = fp * falsePositiveWeight + fn * falseNegativeWeight;
        if (error < minError) {
          minError = error;
          bandAndRow.band = b;
          bandAndRow.row = r;
        }
      }
    }

    return bandAndRow;
  };

  this.integration = function(probability, band, row, a, b) {
    const integrationPrecision = 0.001;
    let area = 0.0;
    let x = a;
    while (x < b) {
      const value = x + 0.5 * integrationPrecision;
      area += probability(value, band, row) * integrationPrecision;
      x += integrationPrecision;
    }
    return area;
  };

  this.getFalsePositive = function(band, row) {
    const falsePositiveProbability = (_value, _band, _row) => {
      return 1 - Math.pow(1 - Math.pow(_value, _row), _band);
    };
    return this.integration(falsePositiveProbability, band, row, 0.0, this.threshold);
  };

  this.getFalseNegative = function(band, row) {
    const falsePositiveProbability = (_value, _band, _row) => {
      return 1 - (1 - Math.pow(1 - Math.pow(_value, _row), _band));
    };
    return this.integration(falsePositiveProbability, band, row, this.threshold, 1.0);
  };
};

if (typeof window !== 'undefined') window.LshIndex = LshIndex;

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = LshIndex;
  }
  exports = LshIndex;
}
