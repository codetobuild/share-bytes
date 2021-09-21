const express = require("express");
const app = express();

// Routes
const notesRoute = require("./routes/notes");
const homeRoute = require("./routes/home");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(express.static("public/uploads"));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/note", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database-connected");
});

// route prefix
app.use("/", homeRoute);
app.use("/notes", notesRoute);

// server setup
app.listen(process.env.PORT || 3000, () => {
  console.log("listening at 3000");
});
