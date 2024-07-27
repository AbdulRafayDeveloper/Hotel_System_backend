const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
// hotel apis Routes start 
const hotelRoutes = require("../routes/hotelApiRoutes/hotelRoutes");
const hotelTypesRoutes = require("../routes/hotelApiRoutes/hotelTypesRoutes");
const hotelInfrastructureRoutes = require("../routes/hotelApiRoutes/hotelInfrastructureRoutes");
const hotel_barRoutes = require("../routes/hotelApiRoutes/hotel_barRoutes");
const hotel_nutritionRoutes = require("../routes/hotelApiRoutes/hotel_nutritionRoutes");
const hotel_serviceRoutes = require("../routes/hotelApiRoutes/hotel_serviceRoutes");
const hotel_transfer_servicesRoutes = require("../routes/hotelApiRoutes/hotel_transfer_servicesRoutes");
const accessibleEnvironmentsRoutes = require("../routes/hotelApiRoutes/accessibleEnvironments");
const beautyAndHealthRoutes = require("../routes/hotelApiRoutes/beautyAndHealth");
const childrenFacilitiesRoutes = require("../routes/hotelApiRoutes/childrenFacilities");
const conferenceFacilitiesRoutes = require("../routes/hotelApiRoutes/conferenceFacilities");
const entertainmentAndSportsRoutes = require("../routes/hotelApiRoutes/entertainmentAndSports");
const hotel_transportRoutes = require("../routes/hotelApiRoutes/hotel_transport");
const roomAmenitiesRoutes = require("../routes/hotelApiRoutes/roomAmenities");
const seaAndBeachRoutes = require("../routes/hotelApiRoutes/seaAndBeach");
const staffRoutes = require("../routes/hotelApiRoutes/staff");
// hotel apis routes end
// payment gateways route //
const YooMoneyRoutes = require("../routes/paymentGateways/YooMoney");
const MIRRoutes = require("../routes/paymentGateways/MIR");
const QIWIRoutes = require("../routes/paymentGateways/QIWI");
const SberbankRoutes = require("../routes/paymentGateways/Sberbank");
const AlfaBankRoutes = require("../routes/paymentGateways/AlfaBank");

// payment gateways route //
const city_routes = require("../routes/city_routes");
const domain_routes = require("../routes/domain_routes");
const excursion_routes = require("../routes/excursion_routes");
const qaas_routes = require("../routes/qaas_routes");
const usersRoutes = require("../routes/auth/usersRoutes");
const rolesRoutes = require("../routes/roles/rolesRoutes");
const bookingRoutes = require("../routes/booking/booking");

const connectionString = process.env.MONGODB_URI;
const MongoUrl = connectionString;

const app = express();
app.use(express.json());
const port = 5000;

// Database Connection
mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", () => {
  console.log("Error occurred in db connection");
});
db.once("open", () => {
  console.log("Connected");
});

// Enable CORS for all routes
app.use(cors());

app.use(express.static("public"));

// Parse incoming requests with urlencoded and json bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send('working now')
})

// Run Route Files APIs
app.use("/api", hotelRoutes);
app.use("/api", hotelTypesRoutes);
app.use("/api", hotelInfrastructureRoutes);
app.use("/api", hotel_barRoutes);
app.use("/api", hotel_nutritionRoutes);
app.use("/api", hotel_serviceRoutes);
app.use("/api", hotel_transfer_servicesRoutes);
app.use("/api", city_routes);
app.use("/api", domain_routes);
app.use("/api", excursion_routes);
app.use("/api", usersRoutes);
app.use("/api", qaas_routes);
app.use("/api", rolesRoutes);
app.use("/api", accessibleEnvironmentsRoutes);
app.use("/api", beautyAndHealthRoutes);
app.use("/api", childrenFacilitiesRoutes);
app.use("/api", conferenceFacilitiesRoutes);
app.use("/api", entertainmentAndSportsRoutes);
app.use("/api", hotel_transportRoutes);
app.use("/api", roomAmenitiesRoutes);
app.use("/api", seaAndBeachRoutes);
app.use("/api", staffRoutes);
app.use("/api", YooMoneyRoutes);
app.use("/api", MIRRoutes);
app.use("/api", QIWIRoutes);
app.use("/api", SberbankRoutes);
app.use("/api", AlfaBankRoutes);
app.use("/api", bookingRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app