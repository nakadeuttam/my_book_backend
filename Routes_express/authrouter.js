require('dotenv').config();
const express = require('express');
const router = express.Router();
const {googleLogin} = require('../middleware/authController')
// Google OAuth login route
router.get('/google', googleLogin);


module.exports = router;
