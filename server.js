try {
    // default settings
    var config = require('./config/settings.js');


    // load packages
    var http = require('http');
    var path = require('path');
    var express = require('express');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var passport = require('passport');
    var cookie_parser = require('cookie-parser');
    var express_session = require('express-session');


    // mongo connection
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongo.connection, { useNewUrlParser: true }, function(err) {
        if (err) {
            console.log(err);
        }
        
        console.log('Mongo connected');
    });


    // setup express
    var app = express();
    app.set('port', config.port);

    // body JSON parsing
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // set public path
    var public_path = path.join(__dirname, 'public');
    app.use(express.static(public_path));

    // sessions
    app.use(cookie_parser());
    app.use(express_session({
        secret: config.session.secret,
        maxAge: config.session.maxAge,
        resave: config.session.resave,
        saveUninitialized: config.session.saveUninitialized
    }));

    // passport
    app.use(passport.initialize());
    app.use(passport.session());


    // setup view engine
    // app.set('view engine', 'pug');


    // setup passport
    require('./helpers/passport_init.js')(passport);


    // load and setup routes
    app.use('/', require('./routes/pages.js')());
    app.use('/api', require('./routes/api.js')());
    app.use('/parrots', require('./routes/parrots.js')());


    // hook node onto ip:port
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Running on http://localhost:' + app.get('port'));
    });
}
catch (err) {
    console.log(err);
    throw err;
}