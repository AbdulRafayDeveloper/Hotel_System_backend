const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("../config/db"); // database connection
const routes = require("../routes/index"); // get all routes

const app = express();
app.use(express.json());
const port = 5000;

app.use(cors()); // api call be called by some other server
app.use(express.static("public")); // public is set as by default folder

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('main project backend is working now')
})

app.use("/", routes); // prefix of all routes is set as "/"

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app