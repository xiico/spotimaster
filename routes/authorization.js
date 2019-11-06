
var querystring = require('querystring');
var request = require('request'); // "Request" library
var stateKey = 'spotify_auth_state';
var redirect_uri = 'http://localhost:5000/callback'
var client_id = 'e303f193728348cc8ee76730b6f21e1e';
var client_secret = '1cdeba65c5ff4916a3fad860cc0ed322';
var mongoose = require('mongoose');
const User = mongoose.model('users');
module.exports = (app) => {

  app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter


    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      console.log('cookies:', req.cookies);
      console.log("storedState:", storedState);
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      console.log('else');
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function (error, response, body) {
        console.log('error: ', error);
        console.log('body: ', body);
        if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
            refresh_token = body.refresh_token;

          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, async function (error, response, body) {
            let user = await User.findOne({ id: body.id });
            if (!user) {
              user = await User.create({
                name: body.display_name,
                id: body.id,
                points: 0,
                date: new Date(),
                picture: body.images[0].url,
                country: body.country
              });
            } 
            else
            {
              user = await User.updateOne(user,
                {
                  $set: {
                    name: body.display_name,
                    picture: body.images[0].url,
                    country: body.country
                  }
                });
            }
            console.log("user", user);
            // we can also pass the token to the browser to make requests from there
            res.redirect('http://localhost:3000/#' + querystring.stringify({ token: access_token }));
          });
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

  app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
}