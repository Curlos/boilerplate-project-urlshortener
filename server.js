require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;
const {v4: uuid} = require("uuid")

const mongoose = require('mongoose');
const validUrl = require('valid-url');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;

const dns = require('dns');

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const urlSchema = new Schema({
  original_url: String,
  short_url: String
})

let Url = mongoose.model('Url', urlSchema);


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:id', async function(req, res) {
  let shortUrl = parseFloat(req.params.id);
  let allUrls = await Url.find({});
  let website = await Url.findOne({short_url: req.params.id})

  if(website != null) {
    let original_url = website['original_url']
    res.redirect(original_url);
  } else {
    res.json({error: 'invalid url'})
  }
});

app.post('/api/shorturl/new', async (req, res) => {
  let validUrlCheck = validUrl.isHttpUri(req.body.url) || validUrl.isHttpsUri(req.body.url)
  if(validUrlCheck != undefined) {
    const url = new Url({
      original_url: req.body.url,
      short_url: uuid()
    })
    url.save((err, data) => {
      res.json(data);
    })
  } else {
    res.json({error: 'Invalid URL'});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
