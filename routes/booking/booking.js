const express = require('express');
const booking = require('../../controllers/booking/booking');

const router = express.Router();

router.post('/booking', booking.add);
router.post('/booking/holidays/:bookingId', booking.addHolidays);
router.get('/booking', booking.view);
router.put('/booking/:id', booking.update);

module.exports = router;