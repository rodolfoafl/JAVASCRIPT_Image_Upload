const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

const app = express();

const port = 3000;

//Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 //1MB
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("imageSelector");

//Check file type
function checkFileType(file, callback) {
  //Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;

  //Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //Check file mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback("Error: Extension not allowed!");
  }
}

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No File Selected!"
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
