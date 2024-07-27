const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // Import crypto module for generating random strings
// Image
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const destinationPath = path.join(__dirname, "../public/thumbnails/excursion");
		cb(null, destinationPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generate a random string
		const extension = path.extname(file.originalname); // Get the file extension
		cb(null, `${uniqueSuffix}${extension}`); // Append the random string to the filename
	}
});

var upload = multer({
	storage: storage
});

module.exports = upload