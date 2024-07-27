const express = require('express');
const axios = require('axios');
const Router = express.Router();

const QIWI_TOKEN = 'your-qiwi-api-token';
// replace themecode also

Router.QIWICreatePayment = async (req, res) => {
    const { amount, currency, comment, email } = req.body;

    const billId = generateBillId();
    const expirationDateTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    try {
        const response = await axios.put(`https://api.qiwi.com/partner/bill/v1/bills/${billId}`, {
            amount: {
                value: amount,
                currency: currency,
            },
            comment: comment,
            expirationDateTime: expirationDateTime,
            customer: {
                email: email,
            },
            customFields: {
                themeCode: "yourThemeCode",
            },
        }, {
            headers: {
                'Authorization': `Bearer ${QIWI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating bill');
    }
};

Router.QIWICheckPayment = async (req, res) => {
    const { billId } = req.params;

    try {
        const response = await axios.get(`https://api.qiwi.com/partner/bill/v1/bills/${billId}`, {
            headers: {
                'Authorization': `Bearer ${QIWI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error checking bill status');
    }
};

Router.QIWICancelPayment = async (req, res) => {
    const { billId } = req.params;

    try {
        const response = await axios.post(`https://api.qiwi.com/partner/bill/v1/bills/${billId}/reject`, {}, {
            headers: {
                'Authorization': `Bearer ${QIWI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error canceling bill');
    }
};

// Generate a unique bill ID
function generateBillId() {
    return 'bill_' + new Date().getTime();
}

module.exports = Router;