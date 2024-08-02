const express = require("express");
const app = express.Router();

// hotel api's
const hotelRoutes = require("./hotelApiRoutes/hotelRoutes");
const hotelTypesRoutes = require("./hotelApiRoutes/hotelTypesRoutes");
const hotelInfrastructureRoutes = require("./hotelApiRoutes/hotelInfrastructureRoutes");
const hotel_barRoutes = require("./hotelApiRoutes/hotel_barRoutes");
const hotel_nutritionRoutes = require("./hotelApiRoutes/hotel_nutritionRoutes");
const hotel_serviceRoutes = require("./hotelApiRoutes/hotel_serviceRoutes");
const hotel_transfer_servicesRoutes = require("./hotelApiRoutes/hotel_transfer_servicesRoutes");
const accessibleEnvironmentsRoutes = require("./hotelApiRoutes/accessibleEnvironments");
const beautyAndHealthRoutes = require("./hotelApiRoutes/beautyAndHealth");
const childrenFacilitiesRoutes = require("./hotelApiRoutes/childrenFacilities");
const conferenceFacilitiesRoutes = require("./hotelApiRoutes/conferenceFacilities");
const entertainmentAndSportsRoutes = require("./hotelApiRoutes/entertainmentAndSports");
const hotel_transportRoutes = require("./hotelApiRoutes/hotel_transport");
const hotel_room_amenitiesRoutes = require("./hotelApiRoutes/hotel_roomAmenities");
const roomEquipmentsRoutes = require("./hotelApiRoutes/roomEquipments");
const roomThumbsRoutes = require("./hotelApiRoutes/roomThumb");
const roomEntertainmentsRoutes = require("./hotelApiRoutes/roomEntertainments");
const roomBathroomRoutes = require("./hotelApiRoutes/roomBathroom");
const seaAndBeachRoutes = require("./hotelApiRoutes/seaAndBeach");
const staffRoutes = require("./hotelApiRoutes/staff");

// payment gateway api's
const YooMoneyRoutes = require("./paymentGateways/YooMoney");
const MIRRoutes = require("./paymentGateways/MIR");
const QIWIRoutes = require("./paymentGateways/QIWI");
const SberbankRoutes = require("./paymentGateways/Sberbank");
const AlfaBankRoutes = require("./paymentGateways/AlfaBank");

// city apis
const city_routes = require("./city_routes");

// domain apis
const domain_routes = require("./domain_routes");

// excursion apis
const excursion_routes = require("./excursion_routes");

// qaas apis
const qaas_routes = require("./qaas_routes");

// user apis
const usersRoutes = require("./auth/usersRoutes");
const rolesRoutes = require("./roles/rolesRoutes");

// booking apis
const bookingRoutes = require("./booking/booking");


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
app.use("/api", hotel_room_amenitiesRoutes);
app.use("/api", roomEquipmentsRoutes);
app.use("/api", roomEntertainmentsRoutes);
app.use("/api", roomBathroomRoutes);
app.use("/api", seaAndBeachRoutes);
app.use("/api", staffRoutes);
app.use("/api", YooMoneyRoutes);
app.use("/api", MIRRoutes);
app.use("/api", QIWIRoutes);
app.use("/api", SberbankRoutes);
app.use("/api", AlfaBankRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roomThumbsRoutes);

module.exports = app;