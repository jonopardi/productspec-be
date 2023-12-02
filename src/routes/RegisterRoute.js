// Importing express module
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const registerController = require('../controllers/auth.controller');
// Handling request using router
router.get('/', registerController.getAllUser);

// router.post('/', registerController.registerUser);
router.post('/', registerController.registerUser);
// Importing the router
module.exports = router;
