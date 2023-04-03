require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const saltRounds = 10;
const JWT = require('./JWTController');
const cookie = require('cookie');

// // Serialize user
// passport.serializeUser((user, done) => {
//     done(null, user._id);
// });

// // Deserialize user
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         if (user) {
//             done(null, user);
//         }
//     } catch (err) {
//         console.log(err);
//     }
// });

// // Login Strategy
// passport.use(
//     'login',
//     new LocalStrategy(
//         {
//             passReqToCallback: true,
//         },
//         async (req, username, password, done) => {
//             try {
//                 const user = await User.findOne({ username: username });
//                 if (!user) {
//                     return done(null, false, {
//                         message: 'Invalid credentials!',
//                     });
//                 }
//                 const result = await bcrypt.compare(password, user.password);
//                 if (!result) {
//                     return done(null, false, {
//                         message: 'Invalid credentials!',
//                     });
//                 }
//                 return done(null, user);
//             } catch (err) {
//                 return done(err);
//             }
//         }
//     )
// );

// // Register Strategy
// passport.use(
//     'register',
//     new LocalStrategy(
//         {
//             passReqToCallback: true,
//         },
//         async (req, username, password, done) => {
//             try {
//                 let user = await User.findOne({ username: username });
//                 if (user) {
//                     return done(null, false, {
//                         message: 'Username already exists',
//                     });
//                 }
//                 const hashed = await bcrypt.hash(password, saltrounds);
//                 user = new User({
//                     username: username,
//                     password: hashed,
//                     name: req.body.name,
//                 });
//                 await user.save();
//                 return done(null, user);
//             } catch (err) {
//                 return done(err);
//             }
//         }
//     )
// );

// exports.isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) next();
//     else res.status(401).json({ error: 'Unauthorized User' });
// };

// Socket middleware
exports.isSocketAuthenticated = async (socket, next) => {
    var cookies = cookie.parse(socket.handshake.headers.cookie);
    const token = cookies.access;
    const refreshToken = cookies.refresh;
    if (!token && !refreshToken) {
        // res.json({ error: 'Unverified user.' });
        return next(new Error('Unverified User'));
    }
    let user = JWT.verifyToken(token);
    if (!user) {
        return next(new Error('Invalid auth. Login again.'));
        // const access = await JWT.regenerateAccessToken(refreshToken);
        // if (!access) {
        //     // res.json({ error: 'Invalid Token' });
        //     return next(new Error('Invalid token'));
        // }
        // user = JWT.verifyToken(access);
        // res.cookie('access', access, {
        //     httpOnly: true,
        //     maxAge: JWT.accessExpiry * 1000,
        //     // secure: true,
        // });
        // res.cookie('user', JSON.stringify(user), {
        //     httpOnly: false,
        //     maxAge: JWT.accessExpiry * 1000,
        //     // secure: true,
        // });
    }
    socket.user = user._doc;
    next();
};

// Middlewares for authorization and authentication checks
exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.access;
    const refreshToken = req.cookies.refresh;
    if (!token && !refreshToken) {
        res.json({ error: 'Unverified user.' });
        return;
    }
    let user = JWT.verifyToken(token);
    if (!user) {
        const access = await JWT.regenerateAccessToken(refreshToken);
        if (!access) {
            res.json({ error: 'Invalid Token' });
            return;
        }
        user = JWT.verifyToken(access);
        res.cookie('access', access, {
            httpOnly: true,
            maxAge: JWT.accessExpiry * 1000,
            // secure: true,
        });
        res.cookie('user', JSON.stringify(user), {
            httpOnly: false,
            maxAge: JWT.accessExpiry * 1000,
            // secure: true,
        });
    }
    req.user = user._doc;
    next();
};

// Helper functions
const userExists = async (username) => {
    const isUser = await User.findOne({ username: username });
    return isUser;
};
const encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};
const comparePassword = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);
    return result;
};

// Controllers for authentication
exports.signup = async (req, res) => {
    try {
        if (!req.body.password) throw 'Invalid Password';
        const isUser = await userExists(req.body.username);
        if (isUser) throw 'User already exists.';
        const newUser = new User({
            username: req.body.username,
            name: req.body.name,
            password: await encryptPassword(req.body.password),
        });
        await newUser.save();
        const err = JWT.setCookies(res, newUser);
        if (err) throw err;
        newUser.password = '';
        res.json(newUser);
    } catch (e) {
        res.json({ error: e || 'Something went wrong!' });
    }
};

exports.signin = async (req, res) => {
    try {
        const isUser = await userExists(req.body.username);
        if (!isUser) throw 'User does not exist.';
        const checkPassword = await comparePassword(
            req.body.password,
            isUser.password
        );
        if (!checkPassword) throw 'Invalid credentials.';
        const err = JWT.setCookies(res, isUser);
        if (err) throw err;
        isUser.password = '';
        res.json(isUser);
    } catch (e) {
        console.log(e);
        res.json({ error: e || 'Something went wrong!' });
    }
};

exports.logout = (req, res) => {
    res.cookie('access', '', {
        httpOnly: true,
        // maxAge: JWT.accessExpiry * 1000,
        // secure: true,
    });
    res.cookie('refresh', '', {
        httpOnly: true,
        // maxAge: JWT.refreshExpiry * 1000,
        // secure: true,
    });
    res.cookie('user', '', {
        httpOnly: false,
        // maxAge: JWT.accessExpiry * 1000,
        // secure: true,
    });
    res.json({ success: 'Logged out successfully.' });
};
