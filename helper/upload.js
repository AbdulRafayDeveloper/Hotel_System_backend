const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const destinationPath = path.join(__dirname, "../public/thumbnails/excursion");
		cb(null, destinationPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = crypto.randomBytes(16).toString('hex');
		const extension = path.extname(file.originalname);
		cb(null, `${uniqueSuffix}${extension}`);
	}
});

var upload = multer({
	storage: storage
});

module.exports = upload