var mongoose=require('mongoose');
var passport = require('passport');
var config = require('./../config/database');
var jwt = require('jwt-simple');

var Schema = mongoose.Schema;
autoIncrement=require('mongoose-auto-increment');
var connection=mongoose.createConnection("mongodb://localhost/node-rest-auth")
autoIncrement.initialize(connection);
var bcrypt= require('bcrypt');
var UserSchema = new Schema({
	name:{
		type:String,
		unique:true,
		required:true
	},
	password:{
		type: String,
		required:true
	},
	FirstName:{
		type:String,
	},

	LastName:String,
	email:{
		type:String,
		unique:true,
		required:true
	},
	Online:Boolean,
	googleId:String,

});

UserSchema.plugin(autoIncrement.plugin,'UserSchema');



UserSchema.pre('save',function(next){
	var user =this;
	if(this.isModified('password')|| this.isNew){
		bcrypt.genSalt(10,function(err,salt){
			if(err){
				return next(err);
			}
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err){
					return next(err);

				}
				user.password = hash;
				next();


			});
		});

	}else{
		return next();

	}
});

UserSchema.methods.comparePassword = function(passw,cb){
	bcrypt.compare(passw,this.password,function(err,isMatch){
		if(err){
			return cb(err);

		}
		cb(null,isMatch);
	});

};
var addUser=mongoose.model('addUser',UserSchema);
exports.userSignUp=function(req,res){
	if(!req.body.name || !req.body.password){
		res.json({success:false,msg:'Please pass name and password.'});
	}else{
		var newUser = new addUser({
			name:req.body.name,
			password:req.body.password,
			FirstName:req.body.FirstName,
			LastName:req.body.LastName,
	email:req.body.email,
	Online:false,



		});
		newUser.save(function(err){
			if(err){
				return res.json({success:false,msg:'Username already exists.'});

			}
			res.json({success:true,msg:'successful created new user.'});
		});
	}
}
exports.authenticate=function(req,res){
	addUser.findOne({
		name:req.body.name
	},function(err,user){
		console.log(user);
		if(err) throw err;
		if(!user){
			res.send({success:false,msg:'Authentication failed.User not found.'});
		}
		else{
			user.comparePassword(req.body.password,function(err,isMatch){
				if(isMatch && !err){
					var token = jwt.encode(user,config.secret);
					res.json({success:true,token:'JWT '+ token,group:undefined,username:user.name,profilepic:undefined,user:user});
				}else{
					res.send({success:false,msg:'Authentication failed.wrong Password.'});
				}
			});
		}
	});
}
exports.addUser=addUser;
exports.findallusers=function(req,res){
	addUser.find({},function(err,data){
		if(!err){
			if(data==''){
				res.sendStatus(400);
			}else{
				res.send(data);

			}

		}else{
			res.send(err);
		}

	});
}
exports.findallusersonline=function(cb){
	addUser.find({},'name Online',function(err,data){
		var dict={};
		console.log(data);
		console.log(dict);
		data.forEach(function(user){
			dict[user.name]=user.Online;
		});
		console.log(dict);
	cb(err,dict);
})

};

exports.saveNewActiveUser=function(activeusername,cb){
	addUser.findOne({
            'name': activeusername,
        }, function(err, user) {
            if (err) {
                return cb(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                console.log("wrong user")
            } else {
                //found user. Return
                user.online=true;
                user.save(function(err){

                	if(err) console.log(err);
                	return cb(err,user)
                })
                return cb(err, user);
            }
        });
  }

exports.addOfflineUser=function(offlineusername,cb){
	addUser.findOne({
            'Username': offlineusername,
        }, function(err, user) {
            if (err) {
                return cb(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
            console.log("wrong user")
            } else {
                //found user. Return
                user.online=false;
                user.save(function(err){

                	if(err) console.log(err);
                	return cb(err,user)
                })
                return cb(err, user);
            }
        });
}
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
