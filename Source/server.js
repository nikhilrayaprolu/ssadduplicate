//all basic library loading
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var passport1 = require('passport');
var config = require('./config/database');
var User = require('./models/user');

var port = process.env.PORT || 8081;
var jwt = require('jwt-simple');
//modules load
var addUser=require("./models/user");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use("/", express.static(__dirname + "/public"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));

mongoose.connect(config.database);
require('./config/passport')(passport);
require('./config/passport1')(passport1);



var server = require('http').Server(app).listen(port);
var io = require('socket.io')(server);
io.sockets.on('connection', function(socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('username',function(username){
    	addUser.findallusersonline(function(err,data){
    		if(err){
    			io.to(socket.id).emit('usersonline', err);
    		}else{
    			io.to(socket.id).emit('usersonline', data);
    		}
    	});
    	
    	socket['username']=username;
    	console.log(username);
    	socket.emit('connected',socket['username']);
    	addUser.saveNewActiveUser(socket['username'],function(err,user){
    		if(err){
    			console.log(err);
    			socket.emit('online',socket['username']);
    		}else{
    			console.log(user);
    			socket.emit('online',socket['username']);
    		}
    	})
	});
    socket.on('disconnect',function(){
    	addUser.addOfflineUser(socket['username'],function(err,user){
    		if(err){
    			console.log(err);
    			socket.emit('offline',socket['username']);
    		}else{
    			socket.emit('offline',socket['username']);
    		}
    	})
        })

  });










var apiRoutes =express.Router();

apiRoutes.post('/signup',addUser.userSignUp);
apiRoutes.post('/authenticate',addUser.authenticate);
app.use('/api',apiRoutes);
app.get('/auth/google',
  passport1.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport1.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  	
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get('/users',addUser.findallusers);
app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/html/index.html');
});



console.log('started the server at localhost:'+port);