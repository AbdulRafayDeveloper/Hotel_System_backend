const express = require('express');
const Router = express.Router();
const Hotel_room_amenities = require('../../models/hotels/Hotel_room_amenities');

Router.addAmenity = async (req, res) => {
	try {
		const { label } = req.body
		if (!label) return res.status(400).json({ message: "Error: Label is required" })
		const amenity = new Hotel_room_amenities({ label })
		await amenity.save();
		return res.status(200).json({ message: 'success' })
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	}
}

Router.listOfAmenity = async (req, res) => {
    try {
        const data = await Hotel_room_amenities.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteAmenity = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Hotel_room_amenities.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await Hotel_room_amenities.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({ status: 200, message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete.' });
    }
};

module.exports = Router