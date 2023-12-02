// Importing express module
const express = require('express');
const router = express.Router();
const formFieldsController = require('../controllers/formFields');
// Handling request using router
router.get('/', formFieldsController.getField);

router.post('/', formFieldsController.addField);
router.delete('/:_id', formFieldsController.deleteField);
// Importing the router
module.exports = router;
