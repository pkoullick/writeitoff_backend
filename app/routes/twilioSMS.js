const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function(app) {
    app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
    });
}