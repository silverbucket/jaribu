var APIeasy = require('api-easy'),
    assert = require('assert');

var scopes = ['When using the Test API', 'the Test Resource'];

//helpers.startServer(3000);

var suite = APIeasy.describe('gig.lc');

//scopes.forEach(function (text) {
//  suite.discuss(text);
//});

suite.discuss('When using the API')
     .discuss('the Ping resource');

//suite.use('localhost', 3000).get('/ping').expect(200, {});


suite
  .discuss('When using application/json in any request')
  .use('localhost', 3000)
  .get('/').expect(200)

//
// Here we will configure our tests to use
// http://localhost:8080 as the remote address
// and to always send 'Content-Type': 'application/json'
//
/*
suite.use('localhost', 3000)
     .setHeader('Content-Type', 'application/json')
     //
     // A GET Request to /ping
     //   should respond with 200
     //   should respond with { pong: true }
     //
     .get('/ping')
       .expect(200, { pong: true })
      //
      // A POST Request to /ping
      //   should respond with 200
      //   should respond with { dynamic_data: true }
      //
     .post('/ping', { dynamic_data: true })
       .expect(200, { dynamic_data: true })
*/