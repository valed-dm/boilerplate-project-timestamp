// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//this is valed-dm API endpoint ...
app.get(
  "/api/:date",
  function(req, res, next) {
    let inputDate = req.params.date;
    let inputAsANumberInMilliseconds = parseInt(inputDate);
    if (inputDate.split(/\D/g).length == 1) {
      req.params.unix = inputAsANumberInMilliseconds;
      req.params.utc = dateAndTime.format(
        new Date(inputAsANumberInMilliseconds),
        "ddd, DD MMM YYYY HH:mm:ss [GMT]"
      );
    } else {
      inputDate = new Date(inputDate);
      if (inputDate.toString() == "Invalid Date") {
        res.json({ error: "Invalid Date" });
      } else {
        req.params.unix = dateAndTime
          .subtract(inputDate, dateAndTime.parse("1970-01-01", "YYYY-MM-DD"))
          .toMilliseconds();
        req.params.utc = dateAndTime.format(
          inputDate,
          "ddd, DD MMM YYYY HH:mm:ss [GMT]"
        );
      }
    }
    next();
  },
  function(req, res) {
    res.json({ unix: req.params.unix, utc: req.params.utc });
  }
);

app.get("/api/", function(req, res) {
  res.json({ unix: new Date().getTime(), utc: new Date() });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
