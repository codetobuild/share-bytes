const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pageCount: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  bookCoverImagePath:{
      type: String,
  },
  bookFilePath:{
      type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
