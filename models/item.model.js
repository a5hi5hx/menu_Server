const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Items = new Schema({
   name: {
        type: String,
        required: true,
        unique: false,
      },
      description: {
        type: String,
        required: true,
        unique: false,
      },
      price: {
        type: String,
        required: true,
        unique: false,
      },
      category: {
        type: String,
        required: true,
        unique: false,
      },
      section: {
        type: String,
        required: true,
        unique: false,
      },
      favorites: {
        type: String,
        unique: false,
      },
      image: {
        type: String,
        required: true,
      },
      
});
module.exports = mongoose.model("Items", Items);
