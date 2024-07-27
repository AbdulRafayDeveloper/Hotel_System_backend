const express = require('express');
const axios = require('axios');
const Router = express.Router();

const SBERBANK_USERNAME = 'your-sberbank-username';
const SBERBANK_PASSWORD = 'your-sberbank-password';
const SBERBANK_API_URL = 'https://securepayments.sberbank.ru/payment/rest/';

Router.SberbankCreatePayment = async (req, res) => {
    const { amount, currency, returnUrl, failUrl, description } = req.body;

    try {
        const response = await axios.post(`${SBERBANK_API_URL}register.do`, null, {
            params: {
                userName: SBERBANK_USERNAME,
                password: SBERBANK_PASSWORD,
                amount: amount * 100, // amount in kopecks
                currency,
                returnUrl,
                failUrl,
                description,
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
};

Router.SberbankCheckPayment = async (req, res) => {
    const { orderId } = req.params;

    try {
        const response = await axios.post(`${SBERBANK_API_URL}getOrderStatus.do`, null, {
            params: {
                userName: SBERBANK_USERNAME,
                password: SBERBANK_PASSWORD,
                orderId,
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching order status');
    }
};

Router.SberbankCancelPayment = async (req, res) => {
    const { orderId, amount } = req.body;

    try {
        const response = await axios.post(`${SBERBANK_API_URL}refund.do`, null, {
            params: {
                userName: SBERBANK_USERNAME,
                password: SBERBANK_PASSWORD,
                orderId,
                amount: amount * 100, // amount in kopecks
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing refund');
    }
};

// Generate a unique order ID (for demonstration purposes)
function generateOrderId() {
    return 'order_' + new Date().getTime();
}

module.exports = Router;