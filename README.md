```
                            _           _                     _             _
                _ __ ___   (_)  _ __   | |__     __ _   ___  | |__         (_)  ___
               | '_ ` _ \  | | | '_ \  | '_ \   / _` | / __| | '_ \        | | / __|
               | | | | | | | | | | | | | | | | | (_| | \__ \ | | | |  _    | | \__ \
               |_| |_| |_| |_| |_| |_| |_| |_|  \__,_| |___/ |_| |_| (_)  _/ | |___/
                                                                         |__/
```

[![Build Status](https://travis-ci.org/duhaime/minhash.svg?branch=master)](https://travis-ci.org/duhaime/minhash)

[Minhashing](https://en.wikipedia.org/wiki/MinHash) is an efficient similarity estimation technique that is often used to identify near-duplicate documents in large text collections. This package offers a JavaScript implementation of the minhash algorithm and an efficient [Locality Sensitive Hashing Index](https://en.wikipedia.org/wiki/Locality-sensitive_hashing) for finding similar minhashes in Node.js or web applications.

## Installation

To get started with Minhash.js, you can install the package with npm:

```bash
npm install minhash --save
```

If you prefer, you can instead load the package directly in a browser:

```html
<script src='https://rawgit.com/duhaime/minhash/master/minhash.min.js' />
```

#### Minhash Usage

Minhashes are hash representations of the contents within a set. The following example minhashes and then estimates the [Jaccard similarity](https://en.wikipedia.org/wiki/Jaccard_index) between two sets:

```javascript
import { Minhash } from 'minhash'; // If using Node.js

var s1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets'];
var s2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents'];

// create a hash for each set of words to compare
var m1 = new Minhash();
var m2 = new Minhash();

// update each hash
s1.map(function(w) { m1.update(w) });
s2.map(function(w) { m2.update(w) });

// estimate the jaccard similarity between two minhashes
m1.jaccard(m2);
```

#### LshIndex Usage

While one can compare the Jaccard similarity between a minhash and all others in a collection, the complexity of doing so is O(n), as one needs to compare the query set to every other set.

To estimate the results of the same comparison in sub-linear time, one can instead build a [Locality Sensitive Hash Index](http://infolab.stanford.edu/~ullman/mmds/ch3.pdf), which maps hash sequences from a minhash signature to the list of document identifiers that contain the given hash sequence. Using this indexing technique, one can effectively find sets similar to a query set:

```javascript
import { Minhash, LshIndex } from 'minhash'; // If using Node.js

var s1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets'];
var s2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents'];
var s3 = ['cats', 'are', 'tall', 'and', 'have', 'been',
        'known', 'to', 'sing', 'quite', 'loudly'];

// generate a hash for each list of words
var m1 = new Minhash();
var m2 = new Minhash();
var m3 = new Minhash();

// update each hash
s1.map(function(w) { m1.update(w) });
s2.map(function(w) { m2.update(w) });
s3.map(function(w) { m3.update(w) });

// add each document to a Locality Sensitive Hashing index
var index = new LshIndex();
index.insert('m1', m1);
index.insert('m2', m2);
index.insert('m3', m3);

// query for documents that appear similar to a query document
var matches = index.query(m1);
console.log('Jaccard similarity >= 0.5 to m1:', matches);
```

### Example

The [sample application](https://duhaime.github.io/minhash/) uses minhash.js to compute the similarity between several [sample documents](https://github.com/duhaime/minhash/tree/gh-pages/texts):

![app preview](https://raw.githubusercontent.com/duhaime/minhash/master/images/preview.png)

There is also a sample Node.js script that can be run with `node examples/index.js`.

### Development

To run the test suite — `npm run test`.  
To compile and minify minhash.min.js — `npm run build`.