
'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let Promise = require('promise');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

//load routes
require('./routes')(app);

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
