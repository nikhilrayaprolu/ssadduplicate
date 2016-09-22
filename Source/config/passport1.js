var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User=require('../models/user').addUser;
GoogleStrategy.prototype.userProfile = function(token, done) {
  done(null, {})
}

module.exports=function(passport){
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: '348438870377-bpfjutn1cc28pm8iq4ovbel2nb9a6cig.apps.googleusercontent.com',
    clientSecret: 'hNFulq_rOT5-WQrNFKcMiLoD',
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
   
    User.findOne({
            'googleId': profile.id 
        }, function(err, user) {
            if (err) {
                return cb(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'google',
                    googleId: profile.id,
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                //found user. Return
                return cb(err, user);
            }
        });
  }
));
}