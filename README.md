# minhash.js

The [Minhash algorithm](https://en.wikipedia.org/wiki/MinHash) is a similarity estimation technique that is often used to identify near-duplicate documents in large text collections. This package offers a JavaScript implementation of the algorithm for use in Node.js or web applications.

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

```javascript
import { Minhash } from 'minhash'; // If using Node.js

var s1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets'];
var s2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents'];

var m1 = new Minhash();
var m2 = new Minhash();

s1.map(function(w) { m1.update(w) });
s2.map(function(w) { m2.update(w) });

// estimate the jaccard similarity between two minhashes
m1.jaccard(m2);
```

#### LshIndex Usage

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

// write a function that updates each hash
s1.map(function(w) { m1.update(w) });
s2.map(function(w) { m2.update(w) });
s3.map(function(w) { m3.update(w) });

// add each document to an LSH index
var index = new LshIndex();
index.insert('m1', m1);
index.insert('m2', m2);
index.insert('m3', m3);

// query for documents that appear similar to a query document
var matches = index.query(m1);
console.log('Jaccard similarity >= 0.5 to m1:', matches);
```

### Example

To execute the sample Node.js script, you can run `node examples/index.js`.

### Development

To run the development utilities, you'll need to install the dependencies: `npm install`.

To run the test suite, run `npm run test`.

To compile and minify minhash.min.js, run `npm run build`.