require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;

const dns = require('dns');

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let urls = {};

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:id', function(req, res) {
  /*dns.lookup('fakewewe.com', (err, address, family) => {
    console.log({err, address, family})
  }); */
  let shortUrl = parseFloat(req.params.id);
  console.log(urls)
  console.log(req.params)
  console.log(Object.values(urls).indexOf(shortUrl))

  if(Object.values(urls).indexOf(shortUrl) > -1) {
    let original_url = Object.keys(urls).find(key => urls[key] === shortUrl);
    res.redirect(original_url);
  } else {
    res.json({error: 'invalid url'})
  }
});

app.post('/api/shorturl/new', (req, res) => {
  urls[req.body.url] = Object.keys(urls).length + 1;
  res.json({
    original_url: req.body.url,
    short_url: 1
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
