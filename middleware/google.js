
var google = require('googleapis');
var Promise = require('promise');

var google_private_key = new Buffer(process.env.google_private_key, 'base64');

var jwtClient = new google.auth.JWT(
  process.env.google_client_email,//key.client_email,
  null,
  google_private_key,//key.private_key,
  ['https://www.googleapis.com/auth/calendar'],
  null
);


var authGoogle = function(){
    return new Promise(function (fulfill, reject){
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log("Error authenticating with google: " + err);
          reject(err);
        }else{
          console.log("Successfully authenticated with google");
          fulfill(tokens);
        }
      });
    });
};

var createMeeting = function(meetingTitle, startDateTime, endDateTime, userEmail, purpose){
  return new Promise(function (fulfill, reject){
      authGoogle().then(function(){
        var jennEmailAddress = "vrjenn@gmail.com";
        var dipeshEmailAddress = 'dgandhi.it@gmail.com';

        console.log("Begng creating Google meeting");
        //calendar logic
        var calendar = google.calendar({
            version: 'v3',
            auth: jwtClient
          });

          // Make an authorized request to create meeting
          calendar.events.insert({
            auth: jwtClient,
            calendarId: jennEmailAddress,
            sendNotifications: true,
            resource : {
              start: { dateTime: startDateTime },
              end: { dateTime: endDateTime },
              summary: meetingTitle,
              description: purpose,
              supportsAttachments: true,
              attendees: [ {email: dipeshEmailAddress}, {email: userEmail } ],
              location: "Call Dipesh @ 720.341.6586",
              reminders: {
                  "useDefault": false,
                  "overrides": [
                    {
                      "method": "email",
                      "minutes": 30
                    },
                    {
                      "method": "popup",
                      "minutes": 30
                    }
                  ]
                }
            }
          }, function (err, resp) {

            if(err){
              reject(err);
              console.log(err);
            }else{
              fulfill(resp);
              console.log(resp);
            }

          });

      });
    });

}


exports.createMeeting = createMeeting;
