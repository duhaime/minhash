var Minhash = require('../src/minhash.js');
var LshIndex = require('../src/lsh.js');

var s1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets'];
var s2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents'];
var s3 = ['cats', 'are', 'tall', 'and', 'have', 'been',
        'known', 'to', 'sing', 'quite', 'loudly'];

var m1 = new Minhash();
var m2 = new Minhash();
var m3 = new Minhash();

function hashWords(words, hash) {
  for (var i=0; i<words.length; i++) {
    hash.update(words[i]);
  }
}

hashWords(s1, m1);
hashWords(s2, m2);
hashWords(s3, m3);

var index = new LshIndex();
index.insert('m1', m1);
index.insert('m2', m2);
index.insert('m3', m3);

var matches = index.query(m1);
console.log('minhashes with estimated Jaccard similarity >= 0.5', matches);