const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/arabic')
	.then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...', err));

const arabic_words = require('./routes/arabic_words');
//const home = require('./routes/home');

const express = require('express');
const app = express(); 



app.set('view engine', 'pug'); //express will load the pug module, we don't have to require it, it is a templating engine 
app.set('views', './views'); //optional setting, ./views is the default value where we store the templates


let absolutePath = '/home/majoros/git/dictionary/views/index.html';

app.use('/api', express.static('public'));

app.get('/api', async (req, res) => { 
  //res.send('Hello word!!!');
  res.sendFile(absolutePath);
});

app.use('/api/arabic_words', arabic_words.router);
//app.use('/api/home', home.router);

const port = process.env.PORT || 3000; // ha nincs az első változó, akkor a port értéke 3000 lesz

app.listen(port, () => console.log(`Listening on port ${port}...`));