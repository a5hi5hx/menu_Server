const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();

mongoose.set("strictQuery", true);
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use( express.static("public"));
app.use(cookieParser());

// Session middleware
const session = require('express-session');
app.use(session({
  secret: process.env.secretkey,
  resave: false,
  saveUninitialized: true,
 
}));


app.get('/', (req, res) => {
  const loggedIn = req.cookies.loggedIn;
  if (loggedIn === 'true') {  
    res.redirect('/action/addItem');
  } else { 
    res.redirect('/login');
  }
});
app.get('/logout', function(req, res) {
  res.clearCookie('loggedIn');
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

const actions = require("./routes/routes");
app.use("/action", actions);
connectDB().then(() => {
    app.listen(process.env.port, () => {
      console.log("listening for requests");
    });
  });