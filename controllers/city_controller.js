const { CITIES_LIMIT_AMOUNT_IN_HOMEPAGE, RECOMMEND_MAX_COUNT } = require("../constants");
const withPrefix = require('../helper/withPrefix');
const express = require('express');
const Router = express.Router();
const City = require('../models/city');
const Domain = require('../models/domain');

/**
 * @query {string} country - The country of the city
 * @returns {array} An array with the information of typical cities in Russia or Abkhazia
 */
Router.typicalCities = async (req, res) => {
    const country = req.query.country
    try {
        // Fetch 6 cities from the database
        const cities = await City.find({ country: country }).limit(CITIES_LIMIT_AMOUNT_IN_HOMEPAGE).sort({ createdAt: 1 }).exec()
        const citiesWithPrefixedThumbnail = cities.map(city => ({
            ...city.toObject(),
            thumbnail: `${withPrefix(req)}${city.thumbnail}`
        }));
        const domainForAllDirections = await Domain.findOne({ key: 'domain-for-all-directions-in-russia' }).select('domain').exec()
        res.json({ data: citiesWithPrefixedThumbnail, domainForAllDirections: domainForAllDirections.domain });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};


/**
 * @param {string} country - The country of the city
 * @returns {array} An array with the information of typical cities in Russia or Abkhazia
 */
Router.addCity = async (req, res) => {
    try {
        // Check if req.file exists and has a filename
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ error: 'Image file not provided' });
        }

        if (!req.body.cityName || req.body.cityName.trim() === '') {
            return res.status(400).json({ error: 'cityName is required' });
        }
        if (!req.body.country || req.body.country.trim() === '') {
            return res.status(400).json({ error: 'country is required' });
        }
        if (!req.body.region || req.body.region.trim() === '') {
            return res.status(400).json({ error: 'region is required' });
        }
        if (!req.body.subdomain || req.body.subdomain.trim() === '') {
            return res.status(400).json({ error: 'subdomain is required' });
        }

        const filename = req.file.filename; // Get the filename from multer

        const thumbnail = `/thumbnails/cities/${filename}`;

        const { cityName, country, region, subdomain } = req.body;

        const city = new City({ cityName, thumbnail, country, region, subdomain });
        await city.save();

        res.status(201).json({ message: 'City added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred in uploading the image' });
    }
};

Router.recommendedPlaces = async (req, res) => {
    const places = [
        'Aurora',
        'Luminaria',
        'Nova Haven',
        'Celestia',
        'Arcadia',
        'Everwood',
        'Willowdale',
        'Silvermist',
        'Ravenhurst',
        'Mistwood',
        'Waverly',
        'Ridgewood',
        'Cypress Hill',
        'Maplebrook',
        'Oakdale',
        'Sageview',
        'Brindlemar',
        'Wynterhaven',
        'Crescentville',
        'Harmony Hills',
        'Morningstar',
        'Sunflower City',
        'Starlight Ridge',
        'Copper Creek',
        'Raven',
        'Luna Vista',
        'Windfall City',
        'Cloudhaven',
        'Diamond Springs',
        'Stardust City',
    ]
    let response = []
    const search = req.query.search
    if (!search) {
        response = Array(RECOMMEND_MAX_COUNT).fill(0).map((i, index) => places[index])
        return res.json(response)
    }

    let count = 0
    for (let i = 0; i < places.length; i++) {
        if (places[i].includes(search)) {
            response.push(places[i])
            count++
            if (count === RECOMMEND_MAX_COUNT) break
        }
    }
    return res.json(response)
};

module.exports = Router;