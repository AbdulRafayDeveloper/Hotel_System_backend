const express = require('express');
const Router = express.Router();
const Domain = require('../models/domain');

Router.setDomain = async (req, res) => {
    try {
        if (!req.body.key) return res.status(400).json({ error: 'key is required' });
        if (!req.body.domain) return res.status(400).json({ error: 'domain is required' });
        const { key } = req.body;
        let domain = await Domain.findOne({ key });
        if (domain) {
            domain.domain = req.body.domain
            await domain.save()
            return res.status(200).json({ message: 'Data set successfully' });
        }
        domain = new Domain({ key: req.body.key, domain: req.body.domain });
        await domain.save();
        res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

module.exports = Router;