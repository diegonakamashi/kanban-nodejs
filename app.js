
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , users = require('./model/user')
  , kanbans = require('./model/kanban')
  , Step = require('step')
  , faye = require('faye')
  , Util = require('util');

var FAYE_PATH = '/faye_channel';
var FAYE_PATH_UPDATE = '/faye_channel_update';

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret_'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

routes.routes(app);

bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
  });

bayeux.attach(app);
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

console.log("Server has started.");

var client = bayeux.getClient();
client.subscribe(FAYE_PATH, function(message) {
	console.log("Server -- Receive message "+ Util.inspect(message) );
	client.publish(FAYE_PATH_UPDATE, message);
}).callback(function() {
	console.log('Subscription is now active!');
}); 

