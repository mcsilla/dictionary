var bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); //router object
const { Word, createWord, getWords, numOfPages } = require('../models/arabic_word');

router.use(bodyParser.urlencoded({ extended: false }));

//var urlencodedParser = bodyParser.urlencoded({ extended: false })
//router.use(express.json()); //a body objecthez kell... ez egy middleware function
//router.use(express.urlencoded({ extended: true }));

const arabicCode = {
	"'": "&#1571;",
	"a": "&#1614;",
	"u": "&#1615;",
	"i": "&#1616;",
	"b": "&#1576;",
	"t": "&#1578;",
	"_t": "&#1579;",
	"^g": "&#1580;",
	".h": "&#1581;",
	"_h": "&#1582;",
	"d": "&#1583;",
	"_d": "&#1584;",
	"r": "&#1585;",
	"z": "&#1586;",
	"s": "&#1587;",
	"^s": "&#1588;",
	".s": "&#1589;",
	".d": "&#1590;",
	".t": "&#1591;",
	".z": "&#1592;",
	"c": "&#1593;",
	".g": "&#1594;",
	"f": "&#1601;",
	"q": "&#1602;",
	"k": "&#1603;",
	"l": "&#1604;",
	"m": "&#1605;",
	"n": "&#1606;",
	"h": "&#1607;",
	"w": "&#1608;",
	"y": "&#1610;",
	"A": "&#1614;&#1575;",
	"_A": "&#1609;",
	"T": "&#1577;",
	"uN": "&#1612;",
	"aN": "&#1611;",
	"iN": "&#1613;",
	"x": "&#1618;",
	"S": "&#1617;",
	"": ""
}


function toArabScript(word) {
	word = word.replace("aa", "A")
	           .replace(/([\.\^_]?[a-z])\1/, '$1S') //sadda kezelése
	           .replace(/([A-Za-z0-9'])(?!N)/g, '$1 ');
	let chars = word.split(' ');
	let arabScript = "";
	chars.forEach(char => {
		arabScript += arabicCode[char];
	})
	//console.log(chars);
	return arabScript;
}

router.use('/', express.static('public'));

router.post('/post-feedback', async function (req, res) {
  const newWord = await createWord(req.body);
  console.log(newWord);
  res.send(req.body);
})

// router.post('/', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   let newWord = new Word ({ name: req.body.name });
//   genre = await genre.save();

//   res.send(genre);
// });

	
router.get('/dictionary', async (req, res) => {
  //const selectedOption = req.params.selected;
  const pageNumber = req.params.page;
  const words = await getWords(pageNumber);
  const maxPage = await numOfPages() + 1;
   //res.send('Hello word!!!');
  res.render('arabic', { 
    title: 'My Arabic Dictionary', 
    selectedOption: 'dictionary', 
    words: words, 
    toArabScript: toArabScript, 
    maxPage: maxPage
  });
});



module.exports.router = router;