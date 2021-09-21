const express = require("express");
const Router = express.Router();
const multer = require("multer");
const path = require("path");

const Note = require("../models/note");
const storagePath = "../public/uploads";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, `${__dirname}/${storagePath}/images`);
    } else {
      cb(null, `${__dirname}/${storagePath}/pdfFiles`);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

// "/notes"
Router.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json({ data: notes });
});

Router.post("/", (req, res) => {
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).fields([
    {
      name: "bookCover",
      maxCount: 1,
    },
    {
      name: "bookFile",
      maxCount: 1,
    },
  ]);

  upload(req, res, async function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files) {
      return res.json({ error: "select valid file type" });
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      console.log(err);
      return res.json({ error: err });
    }
    const data = { ...req.body };
    const files = { ...req.files };
    console.log(files);
    const newBookPayload = {
      title: data.title,
      category: data.category,
      pageCount: data.pageCount,
      bookCoverImagePath: files.bookCover[0].filename,
      bookFilePath: files.bookFile[0].filename,
    };
    const dataBook = await Note.create(newBookPayload);
    console.log(dataBook);
    res.json({ data: dataBook });
    // res.send(
    //   `<img src=/images/${newBookPayload.bookCoverImagePath}></img>`
    // );
  });
});

// "/notes/:id"
Router.get("/:id/download", async (req, res) => {
  const bookId = req.params.id;
  const book = await Note.findById(bookId);
//   res.send('download')
  res.download(`public/uploads/pdfFiles/${book.bookFilePath}`);
});

Router.get("/:id", async (req, res) => {
  const bookId = req.params.id;
  const book = await Note.findById(bookId);
  res.json({ data: book });
});

module.exports = Router;
