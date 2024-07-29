const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error", () => {
    console.log("Error occurred in db connection");
});
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
});