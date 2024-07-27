const express = require('express');
const Router = express.Router();
const User = require('../../models/auth/users');
const Hotel = require('../../models/hotels/Hotels');
const Excursion = require('../../models/excursion/excursion');
require('dotenv').config();
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Define the RegExp for email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Router.ownersSignup = async (req, res) => {
    const { name, position, mail, phoneNumber, password, favouriteHotels, favouriteExcursions } = req.body;
    try {
        if (!name || !position || !mail || !phoneNumber || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate email format
        if (!emailPattern.test(mail)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await User.findOne({ mail });

        if (existingUser) return res.status(400).send('Owner with mail already exists');

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiration = new Date(Date.now() + 60 * 1000);

        const user = new User({
            name: name,
            position: position,
            mail: mail,
            phoneNumber: phoneNumber,
            password: hashedPassword,
            verificationCode: verificationCode,
            codeExpiration: codeExpiration,
            role: "owner",
            favouriteHotels: favouriteHotels,
            favouriteExcursions: favouriteExcursions
        });

        await user.save();

        res.status(201).send('Submitted Successfully');
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error');
    }
};

// login Api //
Router.ownersLogin = async (req, res) => {
    try {
        const { mail, password } = req.body;
        if (mail && password) {
            const user = await User.findOne({ mail: mail });
            if (user) {
                const userStatus = await User.findOne({ mail: mail, role: "owner" });
                if (userStatus) {
                    const passwordMatch = bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        const token = jwt.sign(
                            {
                                id: user._id,
                                name: user.name,
                                mail: user.mail,
                                role: user.role,
                            },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        res.json({ status: 200, message: "Login Successful", data: user, token: token });
                    } else {
                        res.json({ status: 400, message: "Password Not Match." });
                    }
                } else {
                    res.json({ status: 400, message: "You are not Owner." });
                }
            } else {
                res.json({ status: 400, message: "This Account Does Not Exist." });
            }
        } else {
            res.json({ status: 400, message: "Please Input All Required Information" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};

Router.touristLogin = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone Number is required." });
        }

        const user = await User.findOne({ phoneNumber: phoneNumber });

        if (user) {
            const phoneNumberExist = user.phoneNumber;

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const codeExpiration = new Date(Date.now() + 60 * 1000);

            user.verificationCode = verificationCode;
            user.codeExpiration = codeExpiration;
            user.role = "tourist";

            await user.save();

            try {
                await client.messages.create({
                    body: `Your verification code is ${verificationCode}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phoneNumberExist
                });
            } catch (twilioError) {
                console.error("Twilio Error: ", twilioError);
                return res.status(500).send('Error sending SMS');
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).send({ status: 200, data: 'code sent', userid: user.id, token: token });
        } else {
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const codeExpiration = new Date(Date.now() + 60 * 1000);

            const user = new User({
                phoneNumber: phoneNumber,
                verificationCode: verificationCode,
                codeExpiration: codeExpiration,
                role: "tourist"
            });

            await user.save();

            try {
                await client.messages.create({
                    body: `Your verification code is ${verificationCode}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phoneNumber
                });
            } catch (twilioError) {
                console.error("Twilio Error: ", twilioError);
                return res.status(500).send('Error sending SMS');
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).send({ status: 200, data: 'code sent', userid: user.id, token: token });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
};

Router.verifyUser = async (req, res) => {
    const { userid, verificationCode } = req.body;
    try {
        const user = await User.findById(userid);
        if (!user) return res.status(400).send('User not found');

        if (new Date() > user.codeExpiration) return res.status(400).send('Verification code expired');

        if (user.verificationCode !== verificationCode) return res.status(400).send('Invalid verification code');

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                mail: user.mail,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ status: 200, message: "Login Successful", data: user, token: token });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

Router.employeesSignup = async (req, res) => {
    try {
        const { name, position, mail, phoneNumber, password, role } = req.body;

        if (!name || !position || !mail || !phoneNumber || !password || !role) {
            return res.json({ status: 400, message: 'All fields are required' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await User.findOne({ mail });

        if (existingUser) {
            return res.json({ status: 400, message: 'User with mail already exists' });
        }

        const user = new User({
            name: name,
            position: position,
            mail: mail,
            phoneNumber: phoneNumber,
            password: hashedPassword,
            role: role
        });

        const result = await user.save();

        if (result) {
            return res.json({ status: 200, message: 'Your Request Submitted Successfully to the Admin', data: result });
        } else {
            return res.json({ status: 500, message: 'Your Request has not been submitted. Try again Later!' });
        }
    } catch (error) {
        console.log("Catch Block Error: ", error);
        return res.json({ status: 500, message: 'Internal Server Error. Try again Later!', data: error });
    }
};

Router.employeesLogin = async (req, res) => {
    try {
        const { mail, password } = req.body;
        if (mail && password) {
            const user = await User.findOne({ mail: mail });
            if (user) {
                const userStatus = await User.findOne({ mail: mail, role: { $in: ["employee", "admin"] } });
                if (userStatus) {
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    console.log("passwordMatch: ", passwordMatch)
                    if (passwordMatch) {
                        const token = jwt.sign(
                            {
                                id: user._id,
                                name: user.name,
                                mail: user.mail,
                                role: user.role,
                            },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        res.json({ status: 200, message: "Login Successful", data: user, token: token });
                    } else {
                        res.json({ status: 400, message: "Password Not Match." });
                    }
                } else {
                    res.json({ status: 400, message: "You are not an Employee." });
                }
            } else {
                res.json({ status: 400, message: "This Account Does Not Exist." });
            }
        } else {
            res.json({ status: 400, message: "Please Input All Required Information" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request", data: error });
    }
};


Router.listOfEmployees = async (req, res) => {
    // console.log("1");
    try {
        // Extract filters from query parameters
        const {
            mail,
            phoneNumber,
            perPage,
            page
        } = req.query;

        // console.log("req.query: ", req.query);

        // Validation for filters
        if (mail && typeof mail !== 'string') {
            return res.status(400).json({ error: 'City must be a string' });
        }

        // console.log("3");

        if (phoneNumber && typeof phoneNumber !== 'string') {
            return res.status(400).json({ error: 'phone Number must be a string' });
        }

        // console.log("4");

        if (perPage && isNaN(parseInt(perPage, 10))) {
            return res.status(400).json({ error: 'perPage must be a number' });
        }

        // console.log("5");

        if (page && isNaN(parseInt(page, 10))) {
            return res.status(400).json({ error: 'Page must be a number' });
        }

        // console.log("6");

        // Build query object based on provided filters
        const query = {};


        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(perPage, 10) || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        // console.log("7");

        query.role = "employee";

        // Fetch hotels based on query
        const employeesRecords = await User.find(query)
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

        // console.log("employeesRecords: ", employeesRecords);

        res.json({ status: 200, message: "Records fetch Successfully", data: employeesRecords });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while fetching hotels' });
    }
};

Router.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the hotel type exists
        console.log("Delete Id: ", id);
        const data = await User.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Delete the hotel type from the database
        const result = await User.findByIdAndDelete(id);
        console.log("result: ", result);
        if (result) {
            return res.json({ status: 200, message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete.' });
    }
};

Router.getUserRecord = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (data) {
            res.json({ status: 200, message: "Data get Successfully", data: data });
        } else {
            res.json({ status: 400, message: "Data not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateAdminAssignRoles = async (req, res) => {
    try {
        const userData = await User.findById(req.params.id);
        const roles = await req.body.roles;
        console.log("roles: ", roles);
        if (userData) {
            const updateObject = {
                adminAssignedRoles: roles,
            };

            const result = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
            if (result)
                return res.json({ status: 200, message: "Update Successfully" });
            else
                res.json({ status: 400, message: "Not Update" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateUserRecord = async (req, res) => {
    try {
        const checkUser = await User.findById(req.params.id);
        if (checkUser) {

            const { name, mail, phoneNumber } = req.body;

            if (!name || !mail || !phoneNumber) {
                return res.json({ status: 400, message: 'Please fill required fields' });
            }

            let updateObject = {};

            if (checkUser.mail == mail) {
                updateObject = {
                    name,
                    phoneNumber
                };
            } else {
                const existingUser = await User.findOne({ mail });

                if (existingUser) {
                    return res.json({ status: 400, message: 'User with mail already exists' });
                }

                updateObject = {
                    name,
                    mail,
                    phoneNumber
                };
            }

            const result = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject });

            if (result) {
                res.json({ status: 200, message: 'Update Successfully' });
            } else {
                res.json({ status: 400, message: 'Not Update' });
            }

        } else {
            res.json({ status: 400, message: "User not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.getFavoriteHotel = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (data) {
            if (data.favouriteHotels) {
                console.log("Favourite Hotels: ", data.favouriteHotels);
                const hotelData = await Hotel.findById(data.favouriteHotels);
                if (hotelData) {
                    console.log("hotelTitle: ", hotelData.hotelTitle);
                    res.json({ status: 200, message: "Data get Successfully", hotelTitle: hotelData.hotelTitle, data: hotelData });
                } else {
                    res.json({ status: 400, message: "Hotel data not found" });
                }
            } else {
                res.json({ status: 400, message: "This user has no favourite hotel", data: data });
            }
        } else {
            res.json({ status: 400, message: "User not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.getFavoriteExcursion = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (data) {
            if (data.favouriteExcursions) {
                console.log("favouriteExcursions: ", data.favouriteExcursions);
                const excursionData = await Excursion.findById(data.favouriteExcursions);
                if (excursionData) {
                    console.log("excursionData: ", excursionData.title);
                    res.json({ status: 200, message: "Data get Successfully", ExcursionTitle: excursionData.title, data: excursionData });
                } else {
                    res.json({ status: 400, message: "Excursion data not found" });
                }
            } else {
                res.json({ status: 400, message: "This user has no favourite excursion", data: data });
            }
        } else {
            res.json({ status: 400, message: "User not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

module.exports = Router;