'use strict';

// Imports dependencies and set up http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      console.log("Inside for Each");
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      var request = require("request");

var options = { method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/messages',
  qs: { access_token: 'EAAEmDGbpWNkBAAzEepODbNZCkrGOrUct38UgOoldFewKKh3APs3ifLmFpZA7xzoQZBhsTZARcPq3mGN3xf5dJiaigA8ZAeOjsuEwy6eYKPUyzTo06yqM7Qao7fPWOJv94L2XOsM0PoFiokBv5CzYXgBfxodwDS0aT2i9f3GbpXCyysdxsorMjcPpZCvudvEccZD' },
  headers: 
   { 'postman-token': 'eca1db56-5f1a-f6f2-e11c-4cb4fe567c35',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { messaging_type: 'RESPONSE',
     recipient: { id: '1717897904948956' },
     message: { text: 'hello, world!' } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
     
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "1234qwerty"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
