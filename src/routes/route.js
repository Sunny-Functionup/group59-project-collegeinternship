const express = require('express');
const router = express.Router();

const collegeController = require('../controllers/collegeController');
const internsController = require('../controllers/internsController');

//Collage creation
router.post('/functionUp/Colleges', collegeController.collegeCreate);
//Register for internship
router.post('/functionUp/interns', internsController.internCreate);
//List students applied internship
router.get("/functionup/collegeDetails", internsController.getInterns)

module.exports = router;