const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gfg');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/reviews/new', function(req,res){
    var title = req.body.title;
    var desc =req.body.desc;

    var data = {
        "title": title,
        "desc": desc
    }
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Review inserted Successfully");

    });

    return res.redirect('/reviews');
})

require('./routes/authRoutes')(app);
require('./routes/reviewRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
