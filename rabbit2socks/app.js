var cloudfoundry = require('cloudfoundry');
var express = require('express');
var sockjs = require('sockjs');

var app = express.createServer();

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var sockjs_opts = {sockjs_url: "http://sockjs.github.com/sockjs-client/sockjs-latest.min.js"};
var sjs = sockjs.createServer(sockjs_opts);
sjs.installHandlers(app, {prefix: '[/]socks'});

var rabbitUrl = cloudfoundry.getServiceConfig("twitter-rabbit").url;
var context = require('rabbit.js').createContext(rabbitUrl);

context.on('ready', function() {
  sjs.on('connection', function(connection) {
	var sub = context.socket('SUB');
    sub.connect("tweets", function() {
      console.log('subscribed to tweets');
    });
    sub.on('data', function(message) {
      console.log('received tweet: ' + message);
      connection.write(message);
    });
    connection.on('close', function() {
      sub.destroy();
    });
  });
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(cloudfoundry.getAppPort());
