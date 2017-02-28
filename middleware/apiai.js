'use strict';

var apiai = require('apiai');
var util = require('util');

var app = apiai(process.env.apiai_client_access_token);


var sendEvent = function(userSessionId, eventName){

    var event = {
      name: eventName,
      data: {
          //param1: "param1 value",
      }
    };

    var options = { sessionId: userSessionId };

    var request = app.eventRequest(event, options);

    request.on('response', function(response) {
        console.log('event response:' + response);
    });

    request.on('error', function(error) {
        console.log('event error:' + error);
    });

    request.end();

}


exports.sendEvent = sendEvent;
