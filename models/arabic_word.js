const mongoose = require('mongoose');

const Word = mongoose.model('Word', new mongoose.Schema({
  ar_latin: String,
  hun: [ String ],
  root: String,
  projectedRoot: String,
  wordType: { // this is a schema-type object
    type: String,
    required: true,
    enum: ['noun', 'adjective', 'numeral', 'verb'] // ezek közül kerülhet ki csak a category
  },
  tags: [ String ],
  isKnown: Boolean,
  plural: {
    type: String,
    //required: function() { return this.wordType === 'noun' || this.wordType === 'adjective'; }
  },
  verbVowel: {
    type: String,
    //required: function() { return this.wordType === 'verb'}
  },
  infinitive: String
}));

const projectRootCode = {
  "'": "a",
  "b": "b",
  "t": "c",
  "_t": "d",
  "^g": "e",
  ".h": "f",
  "_h": "g",
  "d": "h",
  "_d": "i",
  "r": "j",
  "z": "k",
  "s": "l",
  "^s": "m",
  ".s": "n",
  ".d": "o",
  ".t": "p",
  ".z": "q",
  "c": "r",
  ".g": "s",
  "f": "t",
  "q": "u",
  "k": "v",
  "l": "w",
  "m": "x",
  "n": "y",
  "h": "za",
  "w": "zb",
  "y": "zc"
}

function projectRoot(root) {
  root = root.replace(/([a-z'])(?=.)/g, '$1 ');
  let chars = root.split(' ');
  let projectedRoot = "";
  chars.forEach(char => {
    projectedRoot += projectRootCode[char];
  })
  //console.log(chars);
  return projectedRoot;
}

async function createWord(wordObj) {
  const word = new Word(wordObj);
  //console.log(word);
  word.projectedRoot = projectRoot(word.root);
  return await word.save();
}

const pageSize = 3;

async function numOfPages() {
  const numOfWords = await Word
    .find()
    .count();
  return Math.floor(numOfWords / pageSize) + 1;
}

async function getWords(pageNumber) {
  const words = await Word
    .find()
    .skip((pageNumber - 1) * pageSize) // pagination
    .limit(pageSize)
    .sort({ projectedRoot: 1 });
  //console.log(words);
  return words;
}

module.exports.Word = Word;
module.exports.getWords = getWords;
module.exports.createWord = createWord;
module.exports.numOfPages = numOfPages;