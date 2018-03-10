;(function() {

  // globals
  var loader = document.querySelector('#loader');
  var input = document.querySelector('input');
  var reader = document.querySelector('#file-reader');
  var idToName = {};
  var idToHash = {};
  var idToWindow = {};
  var totalFiles = 0;
  var processedFiles = 0;
  var index = new LshIndex({bandSize: 6});

  // verify user has file reader api
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('Your browser does not support the FILE API');
  }

  // listen for new files
  input.addEventListener('change', handleFiles);

  /**
  * Load default files
  **/

  var files = [
    '34360.txt', '37574.txt', '37615.txt', '38281.txt', '39620.txt',
    '37519.txt', '37582.txt', '37653.txt', '38698.txt', '40075.txt',
    '37560.txt', '37593.txt', '38064.txt', '38797.txt', '37573.txt'
  ];

  for (var i=0; i<files.length; i++) {
    totalFiles++;
    url = 'texts/' + files[i];
    get(url, function(i, url, text) {
      idToName[i] = url;
      handleText(i, text);
    }.bind(null, i, url))
  }

  /**
  * Get a remote asset
  **/

  function get(url, success, err, progress) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          if (success) success(xmlhttp.responseText)
        } else {
          if (err) err(xmlhttp)
        }
      }
    };
    xmlhttp.onprogress = function(e) {if (progress) progress(e)};
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  };

  /**
  * Callback function for new files
  **/

  function handleFiles() {
    loader.style.display = 'block';
    for (var i=0; i<input.files.length; i++) {
      totalFiles++;
      // store the filename for this file
      idToName[i] = input.files[i].name;
      // read the file
      var reader = new FileReader();
      reader.onload = function(i, e) {
        handleText(i, e.target.result);
      }.bind(null, i);
      reader.readAsText(input.files[i]);
    };
  };

  /**
  * Generate all minhashes for a new text file
  * @params:
  *   {int} fileId: the id of a text file
  *   {str} text: the text content from a string
  **/

  function handleText(fileId, text) {
    var filename = idToName[fileId];
    var windows = getTextWindows(tokenize(text), 14);
    for (var i=0; i<windows.length; i++) {
      var hash = hashString(windows[i]);
      var key = fileId + '.' + i;
      idToHash[key] = hash;
      idToWindow[key] = windows[i];
      index.insert(key, hash);
    };
    // if all files have been indexed, find all matches
    if (++processedFiles === totalFiles) findMatches();
  };

  /**
  * Clean and tokenize the string content of a text
  * @params:
  *   {str} str: the string content from a text file
  * @returns:
  *   {arr} a list of tokenized words
  **/

  function tokenize(str) {
    return str.toLowerCase().replace(/\n/g, ' ').split(' ');
  }

  /**
  * Get a list of strings, each representing a window of text
  * from an input document
  * @params:
  *   {arr} words: a list of words
  *   {int} windowSize: the number of words to include in each window
  * @returns:
  *   {arr} a list of strings
  **/

  function getTextWindows(words, windowSize) {
    var windows = [];
    for (var i=0; i<words.length-windowSize; i++) {
      if (i % windowSize === 0) {
        windows.push(words.slice(i, i+windowSize).join(' '));
      }
    }
    return windows;
  }

  /**
  * Update a minhash with all character trigrams from a string
  * @params:
  *   {str} the input string
  * @returns:
  *   {Minhash} an updated Minhash object
  **/

  function hashString(str) {
    var hash = new Minhash();
    for (var i=0; i<str.length-3; i++) {
      var s = str.substring(i, i+3);
      hash.update(s);
    }
    return hash;
  }

  /**
  * For each input file, query for and display all matches
  **/

  function findMatches() {
    var hashIds = Object.keys(idToHash);
    var results = [];
    for (var i=0; i<hashIds.length; i++) {
      var hashId = hashIds[i];
      var matches = index.query(idToHash[hashId]);
      for (var j=0; j<matches.length; j++) {
        if (matches[j] !== hashId) {
          // compare the texts with sequence matcher
          var matchId = matches[j];
          var a = idToWindow[hashId];
          var b = idToWindow[matchId];
          var aFile = idToName[hashId.split('.')[0]];
          var bFile = idToName[matchId.split('.')[0]];
          var sim = new difflib.SequenceMatcher(a, b).ratio();
          if (sim >= 0.6) {
            results.push({
              a: a,
              b: b,
              aFile: aFile,
              bFile: bFile,
              sim: parseInt(sim * 100) / 100,
            })
          }
        }
      }
    }
    render(results)
  }

  /**
  * Render a list of matches to the user
  * @params:
  *   {arr} results: a list of objects, each with a, b, & sim attributes
  **/

  function render(results) {
    sorted = sortArr(results, 'sim');
    window.results = results;
    window.sorted = sorted;
    var template = document.querySelector('#match-template').innerHTML;
    var compiled = _.template(template);
    document.querySelector('#matches').innerHTML = compiled({rows: sorted});
    loader.style.display = 'none';
  }

  /**
  * Sort a list of objects by a provided key
  * @params:
  *   {arr} arr: a list of objects
  *   {attr} attr: the attribute by which to sort
  * @returns:
  *   {arr} the sorted array
  **/

  function sortArr(arr, attr) {
    var sorted = _.sortBy(arr, attr);
    return _.reverse(sorted);
  }

})();