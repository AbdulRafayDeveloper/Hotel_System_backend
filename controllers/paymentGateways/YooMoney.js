const express = require('express');
const axios = require('axios');
const Router = express.Router();

const SHOP_ID = 'your_shop_id'; // Replace with your YooMoney Shop ID
const SECRET_KEY = 'your_secret_key'; // Replace with your YooMoney Secret Key

Router.yoyoMoneyCreatePayment = async (req, res) => {
    const { amount, currency, description } = req.body;

    try {
        const response = await axios.post('https://api.yookassa.ru/v3/payments', {
            amount: {
                value: amount,
                currency: currency
            },
            confirmation: {
                type: 'redirect',
                return_url: 'https://your-website.com/return-url' // Replace with your return URL
            },
            capture: true,
            description: description
        }, {
            auth: {
                username: SHOP_ID,
                password: SECRET_KEY
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

Router.yoyoMoneyPaymentCallback = async (req, res) => {
    const { event, object } = req.body;

    if (event === 'payment.succeeded') {
        const paymentId = object.id;
        const paymentStatus = object.status;
        const paymentAmount = object.amount.value;

        // Handle payment success logic here
        console.log(`Payment succeeded: ID ${paymentId}, Amount ${paymentAmount}`);

        res.status(200).send('OK');
    } else {
        res.status(400).send('Event not handled');
    }
};

module.exports = Router;