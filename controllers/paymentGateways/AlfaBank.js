const express = require('express');
const axios = require('axios');
const Router = express.Router();

const ALFABANK_API_URL = 'https://pay.alfabank.ru/payment/rest/';
const ALFABANK_USERNAME = 'your-alfabank-username';
const ALFABANK_PASSWORD = 'your-alfabank-password';

Router.AlfaBankCreatePayment = async (req, res) => {
    const { amount, currency, returnUrl, failUrl, description } = req.body;

    try {
        const response = await axios.post(`${ALFABANK_API_URL}register.do`, null, {
            params: {
                userName: ALFABANK_USERNAME,
                password: ALFABANK_PASSWORD,
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

Router.AlfaBankCheckPayment = async (req, res) => {
    const { orderId } = req.params;

    try {
        const response = await axios.post(`${ALFABANK_API_URL}getOrderStatus.do`, null, {
            params: {
                userName: ALFABANK_USERNAME,
                password: ALFABANK_PASSWORD,
                orderId,
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching order status');
    }
};

Router.AlfaBankCancelPayment = async (req, res) => {
    const { orderId, amount } = req.body;

    try {
        const response = await axios.post(`${ALFABANK_API_URL}refund.do`, null, {
            params: {
                userName: ALFABANK_USERNAME,
                password: ALFABANK_PASSWORD,
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

Router.AlfaBankPaymentStatusVerify = async (req, res) => {
    try {
        const paymentData = req.body;

        if (verifyPayment(paymentData)) {
            res.status(200).send('Payment verified and processed');
        } else {
            res.status(400).send('Invalid payment data');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing payment status');
    }
};

function verifyPayment(data) {
    // Implement your verification logic here
    // This might involve checking the signature or status of the payment
    // You can customize this function based on your specific needs
    return true;
}

module.exports = Router;