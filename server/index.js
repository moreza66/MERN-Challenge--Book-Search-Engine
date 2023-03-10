require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

mongoose.connect("mongodb://localhost:27017/book", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const db = mongoose.connection;
db.on("error", (error) => console.error("db error:", error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("uploads"));

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const booksRouter = require("./routes/books");
app.use("/books", booksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
