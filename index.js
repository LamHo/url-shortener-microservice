require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./models/Url');
const dns = require('dns');
let bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//API endpoints for project
app.post("/api/shorturl", async function(req, res){
  const requestedUrl = new URL(req.body.url);
  const dnsLookup = dns.lookup(requestedUrl.hostname, async function(err, address, family){
    if (!address) {
      res.json({error: "Invalid URL"});    
    }
    else {
      // Check if the URL is existed
      let url = await Url.findOne({originalUrl: req.body.url});
      if (url) return res.json({ original_url : url.originalUrl, short_url : url.shortenedUrl});
      else {
        urlsAmount = await Url.countDocuments();
        let newUrl = new Url({
          originalUrl: req.body.url,
          shortenedUrl: urlsAmount + 1
        });
  
        await newUrl.save();
        return res.json({ original_url : newUrl.originalUrl, short_url : newUrl.shortenedUrl});
      }
    }
    })
});


app.get("/api/shorturl/:shortenedUrl", async function(req, res){
  if (isNaN(Number(req.params.shortenedUrl))) {
    return res.json({"error":"Wrong format"});
  }
  else {
    let url = await Url.findOne({shortenedUrl: req.params.shortenedUrl});
    if (!url) {
      return res.json({"error":"No short URL found for the given input"});
    }
    else {
      res.redirect(url.originalUrl);
    }
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
