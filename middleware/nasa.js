//var config = require('config');
var Client = require('node-rest-client').Client;
var parser = require('rss-parser');

var client = new Client();
var endpoint = "https://spotthestation.nasa.gov/sightings/xml_files/United_States_";//config.Weather.weatherUri;
console.log("--> Using Endpoint " + endpoint);

var getISSLocation = function(city, state){
  console.log("--> city=" + city);
  console.log("--> state=" + state);

  if(typeof city !== 'undefined' && typeof state !== 'undefined') {

      //replace spaces in city with underscore
      city = city.replace(/\s+/g, '_');

      var url = endpoint + state + "_" + city + ".xml";
      console.log("full-url=" + url);

      parser.parseURL(url, function(err, parsed) {
        if(!err){
        //  console.log(parsed.feed.title);

          var resultJson = [];

          parsed.feed.entries.forEach(function(entry) {

             var content = entry.content.replace(/\n/g,'').replace(/\t/g,'');
             var arry = content.split("<br/>");
             var eventObj = {};

             var arrayLength = arry.length;
             for (var i = 0; i < arrayLength; i++) {

                  var kv = arry[i].split(":");
                  var key = kv[0];
                  var value = kv[1];

                  if(value != undefined){
                      eventObj[key.trim()] = value.trim();
                  }else{
                    arry.splice(i,1);
                  }
             }

             resultJson.push(eventObj);

          });

          var resultJsonStr = JSON.stringify(resultJson);
          console.log(resultJsonStr);


        }else{
          console.log("error:" + error);
        }

      });

  }
}

getISSLocation("Dallas", "Texas");

exports.getISSLocation = getISSLocation;
