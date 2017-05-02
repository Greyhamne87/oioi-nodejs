var express = require('express');
var User = require('./models/user');
var Listing = require('./models/listing');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

  
var app = express();
var port = process.env.PORT || 3000

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/oioi');

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var secret = 'I0S1V0wKL6uOdtSFIIym';


// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); 

    // Pass to next layer of middleware
    next();
});

//Strats

// Non auth
app.post('/user/login', jsonParser, function(req, res, next){

    User.findOne({email: req.body.email},function(err, user){
        if (err){
            return res.status(500).json({
                title: 'An error occured',
                error:err
            });
        }

        if(!user){
            return res.status(401).json({
                title: 'Invalid login credentials',
                error:err
            });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).json({
                title: 'Invalid login credentials',
                error:err
            });
        }

        var token = jwt.sign({user: user}, secret, {expiresIn:7200});
        res.status(200).json({
            message: 'Logged in',
            token: token,
            userId: user._id
        });
    });
});

// Register
app.post('/user/register', jsonParser, function(req, res, next) {

    var email = req.body.email;
    var password = bcrypt.hashSync(req.body.password, 10);

    // An object based on the regiser model
    var user = new User({
        email: email,
        password: password
    });

    // Tell mongoose to save this to the database
    user.save(function(err,result){
        if (err){
            return res.status(500).json({
                title: 'An error occured',
                error:err
            });
        }

        res.status(201).json({
            message: 'Item has been succesfully listed',
            obj: result
        });
    });
});


/** User adding a listing **/
app.post('/user/listItem', jsonParser, function(req, res, next) {



    var title           = req.body.title;
    var subtitle        = req.body.subtitle;
    var category        = req.body.category;
    var description     = req.body.description;
    var cost            = req.body.cost;
    var postage         = req.body.postage;
    var offerPostage    = req.body.offerPostage;
    var orNearestOffer  = req.body.orNearestOffer;
    var ownerId          = req.body.userId;

    

    // An object based on the regiser model
    var listing = new Listing({
        title: title,
        subtitle: subtitle,
        category: category,
        description: description,
        cost: cost,
        postage: postage,
        offerPostage: offerPostage,
        ono: orNearestOffer,
        ownerId: ownerId,

    });

    // Tell mongoose to save this to the database
    listing.save(function(err,result){
        if (err){
            return res.status(500).json({
                title: 'An error occured',
                error:err
            });
        }

        res.status(201).json({
            message: 'Saved the new user',
            obj: result
        });
    });
});



/*
app.use('/', function (req, res, next){
    jwt.verify(req.query.token, this.secret, function(err, decoded){
        if(err){
            return res.status(401).json({
                title: 'Not authenticated',
                error: err
            })
        }
        next();
    })
});
*/

//Invoke the createServer function and assign a port number of 3000
app.listen(port);