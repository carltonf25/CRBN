const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const models = require('./models');
const bcrypt = require('bcrypt');
require('dotenv').config()


const setupAuth = (app) => {
    app.use(cookieParser());

    app.use(session({
        secret: 'whatever',
        resave: true,
        saveUninitialized: true
    }));

    passport.use(new LocalStrategy({
        // options: https://github.com/jaredhanson/passport-local#parameters
        // change these if you want a different field name for username or password
        // usernameField: 'username',
        // passwordField: 'password',
    }, (username, password, done) => {
        // check if there is a user with the username given
        models.user.findOne({
            where: {
                'username': username
            }
        })
            .then((currentUser) => {
                // if there isn't a current User
                if (!currentUser) {
                    // return an error
                    return done(null, false, { message: 'Incorrect username' })
                }
                // If the password doesn't match
                if (!bcrypt.compareSync(password, currentUser.password)) {
                    // return an error
                    return done(null, false, { message: 'Incorrect password' })
                }
                // otherwise, return the user object
                return done(null, currentUser)
            })
            .catch(done);
    }));


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });

    app.use(passport.initialize());

    app.use(passport.session());

    // this is a simple API to check if there is a user

    app.get('/api/user', (req, res, next) => {
        if (req.user) {
            return res.json({ user: req.user })
        } else {
            return res.json({ user: null })
        }
    })

    app.post('/auth/signup', (req, res) => {
        // destructure username and password off req.body into new constants
        const { username, password } = req.body;
        // Check if there is a user with the given username
        models.user.findOne({
            where: {
                'username': username
            }
        })
            .then((currentUser) => {
                // if there is a user already
                if (currentUser) {
                    // return an error
                    return res.json({
                        error: `Sorry, already a username '${username}' is already taken`
                    });
                }
                // otherwise, create a new user and encrypt the password
                models.user.create({
                    'username': username,
                    'password': bcrypt.hashSync(password, 10)
                })
                    .then((newUser) => {
                        // we don't want to return everything, so put all the fields into a new object
                        const data = {
                            ...newUser.get()
                        };
                        // and then delete the password off that object
                        delete data.password;
                        // return the cleaned object
                        return res.json(data);
                    })
                    .catch((err) => {
                        // if there's an error, return that
                        return res.json(err);
                    });
            })
    })

    app.post('/auth/login',
        passport.authenticate('local'),
        (req, res) => {
            // req.user will have been deserialized at this point, so we need
            // to get the values and remove any sensitive ones
            const cleanUser = { ...req.user.get() };
            if (cleanUser.password) {
                console.log(`Removing password from user:`, cleanUser.username);
                delete cleanUser.password
            }
            res.json({ user: cleanUser });
        }
    )

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

    app.get('/logout', function (req, res, next) {
        req.session.destroy();
        res.json({ loggedIn: false });
    });


};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = setupAuth;
module.exports.ensureAuthenticated = ensureAuthenticated;