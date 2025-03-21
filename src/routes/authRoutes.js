const express = require('express');
const { verifyAcc, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/verifyAcc', verifyAcc);
router.post('/login', loginUser);


// Tarea


// router.post("/request-password-reset", requestPasswordReset);
// router.patch("/reset-password/:email", resetPassword);

module.exports = router;
