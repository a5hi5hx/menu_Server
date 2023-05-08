const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
require("dotenv").config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
app.use( express.static("public"));
const Item = require('../models/item.model');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const users = [
    {
      id: 1,
      username: process.env.adminusername,
      password: process.env.adminpassword
    }
  ];
  const checkLoggedIn = (req, res, next) => {
    if (req.cookies.loggedIn === 'true') {
      // User is logged in, proceed to next middleware
      next();
    } else {
      // User is not logged in, redirect to login page
      res.redirect('/login');
    }
  };
  // Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.user) {
      // If user is authenticated, proceed to next middleware
      return next();
    } else {
      // If user is not authenticated, redirect to login page
      return res.redirect('/');
    }
  };
  router.get('/login', checkLoggedIn, (req, res)=> {
    res.render("login");
    });

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user with the given username and password
    const user = users.find((u) => u.username === username && u.password === password);
  
    if (user) {
      // Set the user session data
      req.session.user = { id: user.id, username: user.username };
      // Redirect to the dashboard
      res.cookie('loggedIn', 'true', { maxAge: 7200000, httpOnly: true });
      res.redirect('/action/addItem');
    } else {
      // Set an error message in the session data
      req.session.message = 'Invalid username or password';
      // Redirect to the login page
      res.redirect('/');
    }
  });

  router.get('/addItem', checkLoggedIn, (req, res)=> {
    res.render("add_item");
    });
// handle form submission from HTML page
// router.post('/addItem', authenticateUser, async (req, res) => {
//   try {
//     // upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file);

//     // create new item in database using Mongoose schema
//     const newItem = new Item({
//       name: req.body['item-name'],
//       description: req.body['item-description'],
//       price: req.body['item-price'],
//       category: req.body['item-category'],
//       section: req.body['item-section'],
//       image: result.secure_url,
//       favorites: req.body['item-favorites'] === 'on'
//     });

//     // save new item to database
//     await newItem.save();

//     res.status(200).json({ message: 'Item added successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

router.route("/addItem").post(upload.single('photo'), async (req, res) => {
// const {itemname, itemprice, itemdescription, itemsection, itemcategory} = req.body;
// var image=req.file;
const itemName = req.body.itemname;
  const itemDescription = req.body.itemdescription;
  const itemPrice = req.body.itemprice;
  const itemCategory = req.body.itemcategory;
  const itemSection = req.body.itemsection;
  const addToFavorites = req.body.itemfavorites;
console.log(req.body);
  // Handle file upload here
  var photo = req.file;
  if (!photo) {
  try{
    
      const itemUrl = "https://res.cloudinary.com/ds1swdnv8/image/upload/v1683533663/happy_a0yecu.jpg";
      const item = new Item({
  name:itemName,
  description:itemDescription,
  section:itemSection,
  category:itemCategory,
  price:itemPrice,
  image:itemUrl,
  favorites:addToFavorites,
      });
      item.save().then((item) => {

        res.redirect("/action/addItem");
                
              })
              .catch((err) => {
                res.status(500).json({
                  msg: "Error Saving Item",
                });
              });
   
  }catch(e){
    res.status(500).json({
      msg: "Error Saving Item",
    });
  }
  }
  else {
try{
const pes = await cloudinary.v2.uploader.upload_stream({resource_type: "image"}, (err, pes)=> {
  if(pes) {
    const item = new Item({
name:itemName,
description:itemDescription,
section:itemSection,
category:itemCategory,
price:itemPrice,
image:pes.url,
favorites:addToFavorites,
    });
    item.save().then((item) => {
      res.redirect("/action/addItem");
              
            })
            .catch((err) => {
              res.status(500).json({
                msg: "Error Saving Item",
              });
            });
  }
  else {
    res.status(500).json({ msg: "Error Uploading Image" });
  }
}).end(photo.buffer);
}catch(e){
  console.log(e);
  res.status(500).json({ msg: "Server error" });
}
  }
});



    module.exports = router;
