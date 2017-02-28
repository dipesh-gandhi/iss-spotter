
'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let Promise = require('promise');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

//var apiai = require("./middleware/apiai.js");
require('./routes')(app);

app.get('/', function(req, res) {
     res.send('Hello World!');
});

app.post('/', function (req, res) {

  console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {

            var requestBody = req.body;
            var sessionId = requestBody.sessionId;

            console.log('request: ' + JSON.stringify(requestBody));

            if (requestBody.result) {
                speech = '';

                //Send email for leave a message
                if(requestBody.result.action == "leave-message.yes" && requestBody.result.actionIncomplete == false){

                   console.log("Leave message - send email");
                   var messageBody = requestBody.result.parameters.MessageBody;
                   var fromUser = requestBody.result.parameters.User;
                   var fromEmail = requestBody.result.parameters.UserEmail;
                   var fromPhone = requestBody.result.parameters.UserPhone;

                   var emailBody = "Name: " + fromUser + "\n";
                   emailBody += "Email: " + fromEmail + "\n";
                   emailBody += "Phone: " + fromPhone + "\n\n";

                   emailBody += "Message:\n" + messageBody;

                   email.sendEmail({ // Overriding default parameters
                      subject: 'Jenn says: New message from ' + fromUser,
                      text: emailBody
                      }, function (err, res) {
                          console.log('* [example1] send() callback returned: err:', err, '; res:', res);
                    });
                }

                //Schedule Appointment
                else if(requestBody.result.action == "appointment-confirm-yes" && requestBody.result.actionIncomplete == false){
                   console.log("Schedule Appointment");
                   var contexts = requestBody.result.contexts;

                   var date, time, timeZone, userEmail, purpose, userName;
                   var utcDateTime;

                   for(var context in contexts){
                         var contextName = contexts[context].name;
                         if(contextName == "appointment-confirm"){
                           var params = contexts[context].parameters;
                           date = params.date;
                           time = params.time;
                           timeZone = params["Time-Zone"][0];
                           userEmail = params.UserEmail;
                           purpose = params.Purpose;
                           userName = params.User;


                           // your inputs
                           var dateTimeStr = date + " " + time;


                           switch(timeZone) {
                                case "EST":
                                    timeZone = "America/New_York";
                                    break;
                                case "CST":
                                    timeZone = "America/Chicago";
                                    break;
                                case "MST":
                                    timeZone = "America/Denver";
                                    break;
                                case "PST":
                                    timeZone = "America/Los_Angeles";
                                    break;
                                case "AKST":
                                    timeZone = "America/Anchorage";
                                    break;
                                case "HAST":
                                    timeZone = "America/Honolulu";
                                    break;
                                case "GMT":
                                        timeZone = "Europe/London";
                                        break;
                                default:
                                    timeZone = "America/Chicago"; //default to Central
                                    break;
                           };

                          //var dateObj = new Date(dateTimeStr);
                        /*  var dateObj = new Date(dateTimeStr);
                           console.log("--->startDateTime:" + moment(dateObj).tz(timeZone).format('YYYY-MM-DDTHH:mmZ'));*/


                           var m = moment.tz.setDefault(timeZone);
                           var startDateTime = m.tz(dateTimeStr, timeZone).format();
                           console.log("--->startDateTime:" + startDateTime);

                           //m.add(30,'minutes');
                           var stopDateTime = m.tz(dateTimeStr, timeZone).add(30,'minutes').format();
                           console.log("--->stopDateTime:" + stopDateTime);

                           //create google calendar meeting
                           google.createMeeting("Meeting with Dipesh & " + userName ,startDateTime, stopDateTime, userEmail, purpose).then(function(){
                                apiai.sendEvent(sessionId, "appointment-success");
                           });




                           break;
                         }
                    }


                }


                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                /*if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }*/
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }

  /*
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  // Fulfill action business logic
  function responseHandler (assistant) {
    // Complete your fulfillment logic and send a response
    assistant.tell('Hello, World!');
  }

  assistant.handleRequest(responseHandler);*/
});
// [END YourAction]

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
